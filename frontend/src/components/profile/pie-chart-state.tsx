"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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

interface IssuesByGroupData {
  group: string;
  count: number;
}

interface IssuesByStatePieChartProps {
  data: IssuesByGroupData[];
}

const stateColors = {
  backlog: "#9333ea", // Purple
  unstarted: "#3b82f6", // Blue
  started: "#eab308", // Yellow
  completed: "#22c55e", // Green
  cancelled: "#ef4444", // Red
};

export function IssuesByStatePieChart({ data }: IssuesByStatePieChartProps) {
  const chartData = data.map((item) => ({
    name: item.group,
    value: item.count,
    fill:
      stateColors[item.group as keyof typeof stateColors] ||
      "hsl(var(--chart-5))",
  }));

  const chartConfig = {
    count: {
      label: "Issues",
    },
    ...Object.entries(stateColors).reduce(
      (acc, [key, color]) => ({
        ...acc,
        [key]: {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          color: color,
        },
      }),
      {},
    ),
  } as Record<string, { label: string; color?: string }>;

  const totalIssues = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Issues by State</CardTitle>
        <CardDescription>Overview of project status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              paddingAngle={0}
            >
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: string) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {totalIssues} total issues <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution of issues by state
        </div>
      </CardFooter>
    </Card>
  );
}
