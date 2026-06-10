import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Box, Typography } from "@mui/material";

export default function WeightTrendChart({ data = [] }) {
  const weights = data;

  const chartData = weights.map((item) => ({
    date: item.date.slice(5),
    weight: item.weight,
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
            No weight entries yet
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Add a weight entry to see your
            trend line.
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
      <LineChart
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
          domain={[
            (dataMin) => dataMin - 2,
            (dataMax) => dataMax + 2,
          ]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#667085", fontSize: 12 }}
        />

        <Tooltip
          cursor={{ stroke: "#CBD5E1" }}
          contentStyle={{
            border: "1px solid #E5EAF1",
            borderRadius: 8,
            boxShadow:
              "0 12px 30px rgba(23, 32, 51, 0.08)",
          }}
        />

        <Line
          type="monotone"
          dataKey="weight"
          stroke="#16A34A"
          strokeWidth={3}
          dot={{
            r: 4,
            strokeWidth: 2,
            fill: "#FFFFFF",
          }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
