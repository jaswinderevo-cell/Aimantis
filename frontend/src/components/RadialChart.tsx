'use client';

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/Chart';
import { COLOR_MEDIUM_BLUE, COLOR_VIOLET } from '@/constants/constants';
const chartData = [{ name: 'occupancy', desktop: 50, mobile: 50 }];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--muted))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RadialChart() {
  const totalVisitors = chartData[0].mobile;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={100}
        outerRadius={70}
      >
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="text-[26px] font-bold"
                      fill={COLOR_VIOLET}
                    >
                      {totalVisitors.toLocaleString() + '%'}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="desktop"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-desktop)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="mobile"
          fill={COLOR_MEDIUM_BLUE}
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
