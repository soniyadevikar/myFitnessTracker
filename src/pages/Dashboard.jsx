import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StraightenIcon from "@mui/icons-material/Straighten";

import {
  getLatestWeight,
  calculateBMI,
  bmiCategory,
} from "../utils/dashboardHelpers";
import { getSettings as fetchSettings } from "../services/settingsService";
import { getWeights } from "../services/weightService";
import { getSteps } from "../services/stepService";

const DEFAULT_DASHBOARD_SETTINGS = {
  height: 164,
  starting_weight: 68,
  goal_weight: 58,
  daily_step_goal: 10000,
};

import WeightTrendChart from "../components/dashboard/WeightTrendChart";
import StepsTrendChart from "../components/dashboard/StepsTrendChart";

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
    <Card sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent sx={{ p: 2.25 }}>
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

          <Box sx={{ minWidth: 0 }}>
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
              sx={{ mt: 0.25 }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {helper}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function WeightDeltaCard({
  lost,
  remaining,
}) {
  return (
    <Card sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={2}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={900}
          >
            Weight change
          </Typography>

          <Stack spacing={1.5}>
            <Box>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
              >
                <Box
                  sx={{
                    ...iconTileSx,
                    color: "#16A34A",
                    backgroundColor:
                      "#ECFDF3",
                  }}
                >
                  <MonitorWeightIcon fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={800}
                  >
                    Lost
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={900}
                  >
                    {lost} kg
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
              >
                <Box
                  sx={{
                    ...iconTileSx,
                    color: "#2563EB",
                    backgroundColor:
                      "#EFF6FF",
                  }}
                >
                  <FlagIcon fontSize="small" />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={800}
                  >
                    Remaining
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={900}
                  >
                    {remaining} kg
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent sx={{ p: 2.25 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="h6"
            fontWeight={900}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        </Box>

        {children}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [settings, setSettings] = useState(DEFAULT_DASHBOARD_SETTINGS);
  const [weights, setWeights] = useState([]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, weightData, stepData] =
          await Promise.all([
            fetchSettings(),
            getWeights(),
            getSteps(),
          ]);

        setSettings(settingsData || DEFAULT_DASHBOARD_SETTINGS);

        setWeights(
          (weightData || [])
            .map((item) => ({
              id: item.id,
              date: item.entry_date,
              weight: item.weight,
            }))
            .sort((a, b) =>
              a.date.localeCompare(b.date)
            )
        );

        setSteps(
          (stepData || [])
            .map((item) => ({
              id: item.id,
              date: item.entry_date,
              steps: item.steps,
            }))
            .sort((a, b) =>
              a.date.localeCompare(b.date)
            )
        );
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadData();
  }, []);

  const currentWeight =
    getLatestWeight(weights) ??
    settings.starting_weight;

  const goalWeight = settings.goal_weight;
  const startWeight = settings.starting_weight;
  const height = settings.height;

  const rawLost =
    startWeight - currentWeight;

  const lost = Math.max(0, rawLost).toFixed(2);

  const remaining = Math.max(
    0,
    currentWeight - goalWeight
  ).toFixed(2);

  const totalToLose =
    startWeight - goalWeight;

  const progress =
    totalToLose > 0
      ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            (rawLost / totalToLose) *
            100
          )
        )
      )
      : 0;

  const bmi = calculateBMI(
    currentWeight,
    height
  );

  const bmiText = bmiCategory(
    Number(bmi)
  );

  const bmiColor =
    bmi < 18.5
      ? "#D97706"
      : bmi < 25
        ? "#16A34A"
        : bmi < 30
          ? "#EA580C"
          : "#DC2626";

  const latestStepEntry =
    steps[steps.length - 1] || null;
  const hasStepEntry = steps.length > 0;
  const latestSteps =
    latestStepEntry?.steps || 0;
  const stepDailyGoal =
    settings.daily_step_goal || 10000;
  const stepProgress =
    stepDailyGoal > 0
      ? Math.min(
        100,
        Math.round(
          (latestSteps / stepDailyGoal) * 100
        )
      )
      : 0;

  const todayLabel = new Date().toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "flex-end",
        }}
        gap={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="overline"
            color="primary.dark"
            fontWeight={900}
          >
            Dashboard
          </Typography>

          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "1.8rem",
                md: "2.3rem",
              },
              lineHeight: 1.08,
            }}
          >
            Today&apos;s fitness summary
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,
              maxWidth: 620,
            }}
          >
            Weight, BMI, activity, and
            milestones in one compact view.
          </Typography>
        </Box>

        <Chip
          icon={<EmojiEventsIcon />}
          label={`Only ${remaining} kg left until your goal`}
          color="warning"
          variant="outlined"
          sx={{
            height: 36,
            borderRadius: 2,
            px: 1,
            backgroundColor: "#FFFBEB",
            borderColor: "#FDE68A",
            color: "#B45309",
          }}
        />
      </Stack>

      <Grid container spacing={1.5}>
        <Grid
          item
          xs={12}
          sm={2}
          md={2}
          lg={2}
          xl={2}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              borderColor: "#B7E4C7",
              background:
                "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 70%)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.25}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          ...iconTileSx,
                          color: "#15803D",
                          backgroundColor:
                            "#DCFCE7",
                        }}
                      >
                        <TrendingDownIcon fontSize="small" />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={900}
                      >
                        Weight goal progress
                      </Typography>
                    </Stack>

                    <Typography
                      variant="h2"
                      fontWeight={900}
                      sx={{
                        mt: 1.5,
                        fontSize: {
                          xs: "2.4rem",
                          md: "3rem",
                        },
                        lineHeight: 1,
                      }}
                    >
                      {currentWeight} kg
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 0.75 }}
                    >
                      Goal is{" "}
                      <Box
                        component="span"
                        fontWeight={900}
                        color="text.primary"
                      >
                        {goalWeight} kg
                      </Box>
                      . Remaining:{" "}
                      <Box
                        component="span"
                        fontWeight={900}
                        color="text.primary"
                      >
                        {remaining} kg
                      </Box>
                      .
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      minWidth: 86,
                      textAlign: "right",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      color="primary.dark"
                    >
                      {progress}%
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={800}
                    >
                      complete
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 12,
                      borderRadius: 999,
                      backgroundColor: "#E5EAF1",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #16A34A, #2563EB)",
                      },
                    }}
                  />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 1 }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={800}
                    >
                      {startWeight} kg start
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={800}
                    >
                      {goalWeight} kg goal
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent sx={{ p: 2.25 }}>
              <Stack spacing={1.5}>
                <Stack
                  spacing={1}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={900}
                  >
                    Body Mass Index
                  </Typography>

                  <Chip
                    label={bmiText}
                    size="small"
                    sx={{
                      width: "fit-content",
                      borderRadius: 2,
                      color: bmiColor,
                      backgroundColor:
                        "rgba(22, 163, 74, 0.1)",
                    }}
                  />
                </Stack>

                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{
                    color: bmiColor,
                    mt: 0.75,
                    lineHeight: 1,
                  }}
                >
                  {bmi}
                </Typography>

                <Divider />

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <StraightenIcon
                    fontSize="small"
                    sx={{
                      color: "text.secondary",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Healthy range:{" "}
                    <Box
                      component="span"
                      fontWeight={900}
                      color="text.primary"
                    >
                      18.5 - 24.9
                    </Box>
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 70%)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.25}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          ...iconTileSx,
                          color: "#1D4ED8",
                          backgroundColor:
                            "#DBEAFE",
                        }}
                      >
                        <LocalFireDepartmentIcon fontSize="small" />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={900}
                      >
                        Day progress
                      </Typography>
                    </Stack>

                    {hasStepEntry ? (
                      <>
                        <Typography
                          variant="h2"
                          fontWeight={900}
                          sx={{
                            mt: 1.5,
                            fontSize: {
                              xs: "2.4rem",
                              md: "3rem",
                            },
                            lineHeight: 1,
                          }}
                        >
                          {latestSteps.toLocaleString()}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{ mt: 0.75 }}
                        >
                          of{' '}
                          <Box
                            component="span"
                            fontWeight={900}
                            color="text.primary"
                          >
                            {stepDailyGoal.toLocaleString()}
                          </Box>{' '}
                          daily goal
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5 }}
                      >
                        No step entries yet.
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      minWidth: 86,
                      textAlign: "right",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      color="primary.dark"
                    >
                      {stepProgress}%
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={800}
                    >
                      complete
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={stepProgress}
                    sx={{
                      height: 12,
                      borderRadius: 999,
                      backgroundColor: "#E5EAF1",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #2563EB, #16A34A)",
                      },
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={2} md={3} lg={3} xl={3}>
          <WeightDeltaCard
            lost={lost}
            remaining={remaining}
          />
        </Grid>

        <Grid item xs={12} sm={2} md={3} lg={3} xl={3}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent sx={{ p: 2.25 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      ...iconTileSx,
                      color: "#2563EB",
                      backgroundColor: "#EFF6FF",
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={900}
                    >
                      Today
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={900}
                      sx={{ mt: 0.5, width: "120px" }}
                    >
                      {todayLabel}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            flexBasis: "100%",
            maxWidth: "100%",
          }}
        >
          <ChartCard
            title="Weight trend"
            subtitle="Recent weight entries"
          >
            <WeightTrendChart data={weights} />
          </ChartCard>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            flexBasis: "100%",
            maxWidth: "100%",
          }}
        >
          <ChartCard
            title="Daily steps"
            subtitle="Activity log totals"
          >
            <StepsTrendChart data={steps} />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
