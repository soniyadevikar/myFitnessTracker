import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Box, Typography } from "@mui/material";

export default function StepsTrendChart({ data = [] }) {
  const steps = data;

  const chartData = steps.map((item) => ({
    date: item.date.slice(5),
    steps: item.steps,
  }));

  if (!chartData.length) {
    return (
      <Box
        sx={{
          height: 220,
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
          <Typography fontWeight={800}>
            No step entries yet
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Add daily steps to see your
            activity trend.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={240}
    >
      <BarChart
        data={chartData}
        margin={{
          top: 12,
          right: 16,
          bottom: 4,
          left: -8,
        }}
      >
        <CartesianGrid
          stroke="#E5EAF1"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#667085", fontSize: 12 }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#667085", fontSize: 12 }}
        />

        <Tooltip
          cursor={{
            fill: "rgba(37, 99, 235, 0.08)",
          }}
          contentStyle={{
            border: "1px solid #E5EAF1",
            borderRadius: 8,
            boxShadow:
              "0 12px 30px rgba(23, 32, 51, 0.08)",
          }}
        />

        <Bar
          dataKey="steps"
          fill="#2563EB"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
