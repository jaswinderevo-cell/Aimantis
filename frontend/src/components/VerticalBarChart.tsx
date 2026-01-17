'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { CardContent } from '@/components/ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/Chart';
import { COLOR_MEDIUM_BLUE } from '@/constants/constants';
const chartData = [
  { month: 'May', occupancy: 100 },
  { month: 'june', occupancy: 50 },
  { month: 'July', occupancy: 80 },
  { month: 'Aug', occupancy: 73 },
  { month: 'Sep', occupancy: 100 },
  { month: 'Oct', occupancy: 67 },
  { month: 'Nov', occupancy: 89 },
  { month: 'Dec', occupancy: 45 },
  { month: 'Jan', occupancy: 100 },
  { month: 'Feb', occupancy: 99 },
];

const chartConfig = {
  occupancy: {
    label: 'occupancy',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function VerticalBarGraph() {
  return (
    <>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] overflow-auto w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="occupancy" fill={COLOR_MEDIUM_BLUE} barSize={25} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
