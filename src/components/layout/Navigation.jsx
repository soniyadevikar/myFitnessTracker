import {
  AppBar,
  Box,
  Button,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import SettingsIcon from "@mui/icons-material/Settings";

import { NavLink } from "react-router-dom";

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

export default function Navigation() {
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
        }}
      >
        <Box
          sx={{
            minWidth: {
              xs: 150,
              sm: 190,
            },
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

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            flex: 1,
            justifyContent: {
              xs: "flex-start",
              md: "flex-end",
            },
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
