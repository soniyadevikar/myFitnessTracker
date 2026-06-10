import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FlagIcon from "@mui/icons-material/Flag";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import {
  getWeights,
  saveWeight,
  deleteWeight,
} from "../services/weightService";

const cardSx = {
  borderRadius: 2,
};

const iconTileSx = {
  width: 38,
  height: 38,
  borderRadius: 2,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
};

function StatCard({
  icon,
  label,
  value,
  helper,
  color = "#16A34A",
  background = "#ECFDF3",
}) {
  return (
    <Card sx={{ ...cardSx, width: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Box
            sx={{
              ...iconTileSx,
              color,
              backgroundColor: background,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={800}
            >
              {label}
            </Typography>

            <Typography
              variant="h5"
              fontWeight={900}
              sx={{ mt: 0.5 }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              {helper}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function WeightTracking() {
  const [selectedDate, setSelectedDate] =
    useState(dayjs());

  const [weight, setWeight] =
    useState("");

  const [entries, setEntries] =
    useState([]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await getWeights();
        const formatted = (data || []).map(
          (item) => ({
            id: item.id,
            date: item.entry_date,
            weight: item.weight,
          })
        );
        formatted.sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        setEntries(formatted);
      } catch (error) {
        console.error("Failed to load weight entries:", error);
      }
    };

    loadEntries();
  }, []);

  const addEntry = async () => {
    if (!weight) return;

    const entryDate = selectedDate.format("YYYY-MM-DD");
    const existingEntry = entries.find(
      (entry) => entry.date === entryDate
    );

    const updated = existingEntry
      ? entries.map((entry) =>
          entry.date === entryDate
            ? { ...entry, weight: Number(weight) }
            : entry
        )
      : [
          ...entries,
          {
            id: Date.now(),
            date: entryDate,
            weight: Number(weight),
          },
        ];

    updated.sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    try {
      await saveWeight(entryDate, Number(weight));
      setEntries(updated);
      setWeight("");
    } catch (error) {
      console.error("Failed to save weight entry:", error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteWeight(id);
      setEntries(
        entries.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete weight entry:", error);
    }
  };

  const stats = useMemo(() => {
    if (!entries.length) {
      return {
        latest: "-",
        change: "-",
        lowest: "-",
        latestDate: "No entries yet",
      };
    }

    const first = entries[0];
    const latest =
      entries[entries.length - 1];
    const lowest = entries.reduce(
      (min, entry) =>
        entry.weight < min.weight
          ? entry
          : min,
      entries[0]
    );
    const change =
      latest.weight - first.weight;
    const changePrefix =
      change > 0 ? "+" : "";

    return {
      latest: `${latest.weight} kg`,
      change: `${changePrefix}${change.toFixed(1)} kg`,
      lowest: `${lowest.weight} kg`,
      latestDate: latest.date,
    };
  }, [entries]);

  const milestones = [68, 65, 63, 60, 58];
  const latestWeight =
    entries.length > 0
      ? entries[entries.length - 1].weight
      : null;
  const completedMilestones =
    latestWeight !== null
      ? milestones.filter(
          (milestone) =>
            latestWeight <= milestone
        ).length
      : 0;

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        gap={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="overline"
            color="primary.dark"
            fontWeight={900}
          >
            Weight Tracking
          </Typography>

          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "1.65rem",
                sm: "2rem",
                md: "2.2rem",
              },
              lineHeight: 1.1,
            }}
          >
            Log weight changes
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
              maxWidth: 620,
              fontSize: {
                xs: 14,
                md: 16,
              },
            }}
          >
            Keep a tidy history of your
            weigh-ins and watch the trend
            build over time.
          </Typography>
        </Box>

        <Chip
          icon={<MonitorWeightIcon />}
          label={`${entries.length} entries`}
          color="primary"
          variant="outlined"
          sx={{
            height: 36,
            borderRadius: 2,
            px: 1,
            backgroundColor: "#FFFFFF",
          }}
        />
      </Stack>

      <Grid
        container
        spacing={2}
        alignItems="flex-start"
      >
        <Grid item xs={12} lg={8}>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <StatCard
                  icon={<MonitorWeightIcon />}
                  label="Latest weight"
                  value={stats.latest}
                  helper={stats.latestDate}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  icon={<TrendingDownIcon />}
                  label="Change from first log"
                  value={stats.change}
                  helper="Negative values mean weight lost."
                  color="#2563EB"
                  background="#EFF6FF"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  icon={<ShowChartIcon />}
                  label="Lowest logged"
                  value={stats.lowest}
                  helper="Your lowest saved weight."
                  color="#D97706"
                  background="#FFFBEB"
                />
              </Grid>
            </Grid>

            <Card sx={cardSx}>
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      justifyContent="space-between"
                      alignItems={{
                        xs: "flex-start",
                        sm: "center",
                      }}
                      gap={1}
                      sx={{ mb: 1.25 }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={900}
                        >
                          Weight milestones
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Track your current weight against key milestones.
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={900}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {completedMilestones}/{milestones.length} complete
                      </Typography>
                    </Stack>

                    {latestWeight === null ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Add a weight entry to begin milestone progress.
                      </Typography>
                    ) : (
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {milestones.map(
                          (milestone) => {
                            const isComplete =
                              latestWeight <=
                              milestone;

                            return (
                              <Chip
                                key={milestone}
                                label={`${milestone} kg`}
                                icon={
                                  isComplete ? (
                                    <EmojiEventsIcon />
                                  ) : (
                                    <FlagIcon />
                                  )
                                }
                                color={
                                  isComplete
                                    ? "primary"
                                    : "default"
                                }
                                variant={
                                  isComplete
                                    ? "filled"
                                    : "outlined"
                                }
                                size="small"
                                sx={{
                                  borderRadius: 2,
                                  minWidth: 88,
                                  justifyContent:
                                    "flex-start",
                                }}
                              />
                            );
                          }
                        )}
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={cardSx}>
              <CardContent sx={{ p: 2 }}>
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  gap={1}
                  sx={{ mb: 1.5 }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={900}
                    >
                      Weight history
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Entries are sorted by
                      date.
                    </Typography>
                  </Box>
                </Stack>

                {entries.length ? (
                  <TableContainer
                    sx={{
                      border: "1px solid #E5EAF1",
                      borderRadius: 2,
                      maxHeight: {
                        xs: 320,
                        md: 430,
                      },
                    }}
                  >
                    <Table
                      stickyHeader
                      size="small"
                    >
                      <TableHead
                        sx={{
                          backgroundColor:
                            "#F8FAFC",
                        }}
                      >
                        <TableRow>
                          <TableCell>
                            Date
                          </TableCell>

                          <TableCell>
                            Weight
                          </TableCell>

                          <TableCell align="right">
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {entries.map(
                          (entry) => (
                            <TableRow
                              key={
                                entry.id
                              }
                              hover
                            >
                              <TableCell
                                sx={{
                                  fontWeight: 700,
                                }}
                              >
                                {
                                  entry.date
                                }
                              </TableCell>

                              <TableCell>
                                <Typography fontWeight={800}>
                                  {
                                    entry.weight
                                  }{" "}
                                  kg
                                </Typography>
                              </TableCell>

                              <TableCell align="right">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    deleteEntry(
                                      entry.id
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      minHeight: 220,
                      display: "grid",
                      placeItems: "center",
                      border: "1px dashed #CBD5E1",
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                      textAlign: "center",
                      px: 3,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          ...iconTileSx,
                          mx: "auto",
                          mb: 1.5,
                          color: "#16A34A",
                          backgroundColor:
                            "#ECFDF3",
                        }}
                      >
                        <FitnessCenterIcon />
                      </Box>

                      <Typography fontWeight={900}>
                        No weight entries yet
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Add your first entry to
                        start building a history.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={900}
                  >
                    Add entry
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Save one weigh-in at a
                    time.
                  </Typography>
                </Box>

                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(value) =>
                    setSelectedDate(
                      value || dayjs()
                    )
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />

                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  fullWidth
                  onChange={(e) =>
                    setWeight(
                      e.target.value
                    )
                  }
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addEntry}
                  sx={{ height: 46 }}
                >
                  Add weight entry
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
