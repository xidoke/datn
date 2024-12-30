"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  YAxis,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PriorityChartProps {
  data: Array<{
    priority: number;
    count: number;
  }>;
}

const priorityLabels: Record<number, string> = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "None",
};

const priorityColors: Record<number, string> = {
  4: "hsl(0 84% 60%)", // Red for Urgent (text-red-600)
  3: "hsl(30 96% 62%)", // Orange for High (text-orange-500)
  2: "hsl(48 96% 53%)", // Yellow for Medium (text-yellow-500)
  1: "hsl(217 91% 60%)", // Blue for Low (text-blue-500)
  0: "hsl(220 9% 46%)", // Gray for None (text-gray-400)
};

const chartConfig = {
  count: {
    label: "Count",
  },
  ...Object.entries(priorityLabels).reduce(
    (acc, [priority, label]) => ({
      ...acc,
      [label.toLowerCase()]: {
        label,
        color: priorityColors[Number(priority)],
      },
    }),
    {},
  ),
} satisfies ChartConfig;

export function IssuesByPriorityChart({ data }: PriorityChartProps) {
  const chartData = Object.entries(priorityLabels)
    .map(([priority, label]) => ({
      priority: label,
      count: data.find((d) => d.priority === Number(priority))?.count || 0,
      fill: priorityColors[Number(priority)],
    }))
    .reverse();

  const totalIssues = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues by Priority</CardTitle>
        <CardDescription>Current project status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            width={500}
            height={300}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="priority"
              type="category"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              width={80}
              domain={["dataMin", "dataMax"]}
            />
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="count"
              barSize={20}
              radius={[0, 4, 4, 0]}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.fill}
                  strokeWidth={2}
                  strokeDasharray={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totalIssues} total issues <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing issue distribution by priority
        </div>
      </CardFooter>
    </Card>
  );
}
