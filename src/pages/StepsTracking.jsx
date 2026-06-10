import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
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
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import {
  getSteps,
  saveSteps,
  deleteSteps,
} from "../services/stepService";

const dailyGoal = 10000;

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

function average(entries, count) {
  if (!entries.length) return 0;

  const recent = entries.slice(-count);
  const total = recent.reduce(
    (sum, item) => sum + item.steps,
    0
  );

  return Math.round(total / recent.length);
}

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

export default function StepsTracking() {
  const [date, setDate] =
    useState(dayjs());

  const [steps, setSteps] =
    useState("");

  const [entries, setEntries] =
    useState([]);

  useEffect(() => {
    const selectedDate =
      date.format("YYYY-MM-DD");

    const existingEntry =
      entries.find(
        (entry) =>
          entry.date === selectedDate
      );

    if (existingEntry) {
      setSteps(
        existingEntry.steps.toString()
      );
    } else {
      setSteps("");
    }
  }, [date, entries]);
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await getSteps();
        const formatted = (data || []).map(
          (item) => ({
            id: item.id,
            date: item.entry_date,
            steps: item.steps,
          })
        );
        formatted.sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        setEntries(formatted);
      } catch (error) {
        console.error("Failed to load steps:", error);
      }
    };

    loadEntries();
  }, []);

  const addEntry = async () => {
    if (!steps) return;

    const selectedDate =
      date.format("YYYY-MM-DD");

    const existingEntry =
      entries.find(
        (entry) =>
          entry.date === selectedDate
      );

    let updated = [];

    if (existingEntry) {
      updated = entries.map((entry) =>
        entry.date === selectedDate
          ? { ...entry, steps: Number(steps) }
          : entry
      );
    } else {
      updated = [
        ...entries,
        {
          id: Date.now(),
          date: selectedDate,
          steps: Number(steps),
        },
      ];
    }

    updated.sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    try {
      await saveSteps(selectedDate, Number(steps));
      setEntries(updated);
      setSteps("");
    } catch (error) {
      console.error("Failed to save steps:", error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteSteps(id);
      setEntries(
        entries.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete step entry:", error);
    }
  };

  const stats = useMemo(() => {
    const latest =
      entries[entries.length - 1];
    const best = entries.length
      ? entries.reduce(
        (max, entry) =>
          entry.steps > max.steps
            ? entry
            : max,
        entries[0]
      )
      : null;
    const weeklyAverage = average(
      entries,
      7
    );
    const monthlyAverage = average(
      entries,
      30
    );
    const latestSteps =
      latest?.steps || 0;
    const goalProgress = Math.min(
      100,
      Math.round(
        (latestSteps / dailyGoal) *
        100
      )
    );

    return {
      latest,
      best,
      weeklyAverage,
      monthlyAverage,
      goalProgress,
    };
  }, [entries]);

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
            Steps Tracking
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
            Log daily movement
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
            Capture step totals, compare
            averages, and keep your daily
            rhythm visible.
          </Typography>
        </Box>

        <Chip
          icon={<DirectionsWalkIcon />}
          label={`${entries.length} entries`}
          color="secondary"
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
                  icon={<InsightsIcon />}
                  label="Weekly average"
                  value={stats.weeklyAverage.toLocaleString()}
                  helper="Average from the latest 7 logs."
                  color="#2563EB"
                  background="#EFF6FF"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  icon={<QueryStatsIcon />}
                  label="Monthly average"
                  value={stats.monthlyAverage.toLocaleString()}
                  helper="Average from the latest 30 logs."
                  color="#16A34A"
                  background="#ECFDF3"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  icon={<EmojiEventsIcon />}
                  label="Best day"
                  value={
                    stats.best
                      ? stats.best.steps.toLocaleString()
                      : "0"
                  }
                  helper={
                    stats.best
                      ? stats.best.date
                      : "No entries yet"
                  }
                  color="#D97706"
                  background="#FFFBEB"
                />
              </Grid>
            </Grid>

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
                      Steps history
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Your daily step totals in
                      date order.
                    </Typography>
                  </Box>
                </Stack>

                {entries.length ? (
                  <TableContainer
                    sx={{
                      border: "1px solid #E5EAF1",
                      borderRadius: 2,
                      maxHeight: {
                        xs: 340,
                        md: 520,
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
                            Steps
                          </TableCell>

                          <TableCell>
                            Goal
                          </TableCell>

                          <TableCell align="right">
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {entries.map(
                          (entry) => {
                            const goalPercent =
                              Math.min(
                                100,
                                Math.round(
                                  (entry.steps /
                                    dailyGoal) *
                                  100
                                )
                              );

                            return (
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
                                    {entry.steps.toLocaleString()}
                                  </Typography>
                                </TableCell>

                                <TableCell
                                  sx={{
                                    minWidth: 150,
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Box
                                      sx={{
                                        flex: 1,
                                      }}
                                    >
                                      <LinearProgress
                                        variant="determinate"
                                        value={
                                          goalPercent
                                        }
                                        sx={{
                                          height: 8,
                                          borderRadius: 999,
                                          backgroundColor:
                                            "#E5EAF1",
                                          "& .MuiLinearProgress-bar":
                                          {
                                            borderRadius: 999,
                                          },
                                        }}
                                      />
                                    </Box>

                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight={800}
                                    >
                                      {goalPercent}%
                                    </Typography>
                                  </Stack>
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
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      minHeight: 240,
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
                          color: "#2563EB",
                          backgroundColor:
                            "#EFF6FF",
                        }}
                      >
                        <DirectionsWalkIcon />
                      </Box>

                      <Typography fontWeight={900}>
                        No step entries yet
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Add your first daily
                        total to start tracking
                        movement.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            <Card
              sx={{
                borderRadius: 2,
                borderColor: "#BFDBFE",
                background:
                  "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={800}
                    >
                      Latest day progress
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight={900}
                      sx={{
                        mt: 0.5,
                        fontSize: "2rem",
                      }}
                    >
                      {stats.latest
                        ? stats.latest.steps.toLocaleString()
                        : "0"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      of{" "}
                      {dailyGoal.toLocaleString()}{" "}
                      daily goal
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={stats.goalProgress}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: "#DBEAFE",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #2563EB, #16A34A)",
                      },
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={800}
                  >
                    {stats.goalProgress}% complete
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

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
                      Save one daily total at
                      a time.
                    </Typography>
                  </Box>

                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(value) =>
                      setDate(
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
                    label="Steps"
                    type="number"
                    value={steps}
                    fullWidth
                    onChange={(e) =>
                      setSteps(
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
                    Add steps entry
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
