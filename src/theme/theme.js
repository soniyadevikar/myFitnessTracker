import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#16A34A",
      dark: "#15803D",
      light: "#86EFAC",
    },
    secondary: {
      main: "#2563EB",
    },
    warning: {
      main: "#D97706",
    },
    error: {
      main: "#DC2626",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#172033",
      secondary: "#667085",
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { letterSpacing: 0 },
    h2: { letterSpacing: 0 },
    h3: { letterSpacing: 0 },
    h4: { letterSpacing: 0 },
    h5: { letterSpacing: 0 },
    h6: { letterSpacing: 0 },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E5EAF1",
          boxShadow: "0 12px 30px rgba(23, 32, 51, 0.06)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          "&:last-child": {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
