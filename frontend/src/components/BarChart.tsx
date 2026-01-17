import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import { COLOR_MEDIUM_BLUE } from "@/constants/constants";

const chartData = [
  { Days: "Today", mobile: 80 },
  { Days: "7 Days", mobile: 100 },
  { Days: "30 days", mobile: 70 },
];

const chartConfig = {
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function ChartBarLabelCustom() {
  const chartHeight = chartData.length * 60;

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 50, bottom: 10, left: 20 }}
          barCategoryGap={20} 
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="Days"
            type="category"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ fontSize: "16px", fontWeight: "500" }}
          />
          <XAxis dataKey="mobile" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="mobile"
            layout="vertical"
            fill={COLOR_MEDIUM_BLUE}
            barSize={10}
            radius={4}
          >
            <LabelList
              dataKey="mobile"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize="16px"
              fontWeight={500}
              formatter={(value: number) => `${value}$`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
