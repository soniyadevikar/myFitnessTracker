import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { NavLink } from "react-router-dom";
import { getWeights } from "../../services/weightService";
import { getSettings as fetchSettings } from "../../services/settingsService";

const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: DashboardIcon,
  },
  {
    name: "Weight",
    path: "/weight",
    icon: MonitorWeightIcon,
  },
  {
    name: "Steps",
    path: "/steps",
    icon: DirectionsWalkIcon,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: SettingsIcon,
  },
];

function getLatestWeight(weights) {
  if (!weights.length) return null;
  return weights[weights.length - 1].weight;
}

export default function Navigation() {
  const [remaining, setRemaining] = useState("0.00");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weightData, settingsData] =
          await Promise.all([
            getWeights(),
            fetchSettings(),
          ]);

        const DEFAULT_SETTINGS = {
          starting_weight: 68,
          goal_weight: 58,
        };

        const settings = settingsData || DEFAULT_SETTINGS;

        const weights = (weightData || []).map(
          (item) => ({
            weight: item.weight,
          })
        );

        const currentWeight =
          getLatestWeight(weights) ??
          settings.starting_weight;
        const goalWeight = settings.goal_weight;

        const remainingKg = Math.max(
          0,
          currentWeight - goalWeight
        ).toFixed(2);

        setRemaining(remainingKg);
      } catch (error) {
        console.error(
          "Failed to load navigation data:",
          error
        );
      }
    };

    loadData();
  }, []);
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid #E5EAF1",
        backgroundColor:
          "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(16px)",
        zIndex: 1200,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            md: 72,
          },
          gap: 2,
          px: {
            xs: 2,
            sm: 3,
            lg: 4,
          },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            minWidth: {
              xs: 150,
              sm: 190,
            },
            flex: 0,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={900}
            color="text.primary"
            sx={{
              lineHeight: 1.1,
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
              },
            }}
          >
            Fitness Coach
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            Daily progress tracker
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Chip
            icon={<EmojiEventsIcon />}
            label={`Only ${remaining} kg left until your goal`}
            color="warning"
            variant="outlined"
            sx={{
              height: 32,
              borderRadius: 2,
              px: 1,
              backgroundColor: "#FFFBEB",
              borderColor: "#FDE68A",
              color: "#B45309",
            }}
          />
        </Box>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            flex: 0,
            minWidth: "max-content",
            overflowX: "auto",
            pb: 0.25,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === "/"}
                startIcon={
                  <Icon fontSize="small" />
                }
                sx={{
                  minWidth: "max-content",
                  px: {
                    xs: 1.25,
                    sm: 1.75,
                  },
                  py: 1,
                  borderRadius: 2,
                  color: "text.secondary",
                  "&.active": {
                    color: "primary.dark",
                    backgroundColor: "#ECFDF3",
                  },
                  "&.active .MuiButton-startIcon":
                    {
                      color: "primary.dark",
                    },
                }}
              >
                {item.name}
              </Button>
            );
          })}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
