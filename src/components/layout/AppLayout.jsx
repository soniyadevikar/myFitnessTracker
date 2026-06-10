import { Box } from "@mui/material";

import Navigation from "./Navigation";

export default function AppLayout({
  children,
}) {
  return (
    <>
      <Navigation />

      <Box
        sx={{
          minHeight: "100vh",
          pt: {
            xs: 3,
            md: 4,
          },
          px: {
            xs: 2,
            sm: 3,
            lg: 4,
          },
          pb: {
            xs: 5,
            md: 5,
          },
          background:
            "linear-gradient(180deg, #F8FAFC 0%, #EEF4F8 100%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1280,
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
