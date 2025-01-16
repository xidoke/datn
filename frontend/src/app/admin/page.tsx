"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, FileText, Settings, LogOut, User } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useLogout } from "@/hooks/useLogout";
import { useAppRouter } from "@/hooks/use-app-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from "@/helpers/common.helper";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  workspaces: {
    label: "Workspaces",
    color: "hsl(var(--chart-2))",
  },
  projects: {
    label: "Projects",
    color: "hsl(var(--chart-3))",
  },
  issues: {
    label: "Issues",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function AdminHomePage() {
  const { data: user } = useUserStore();
  const logout = useLogout();
  const router = useAppRouter();
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();
  const [chartData, setChartData] = useState<
    {
      month: string;
      users: number;
      workspaces: number;
      projects: number;
      issues: number;
    }[]
  >([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalWorkspaces: 0,
    totalProjects: 0,
    totalIssues: 0,
  });

  const handleProfile = () => {
    router.push("/admin/profile");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(API_BASE_URL + "/users/admin/chart-data", {
          credentials: "include",
        });
        const result = await response.json();
        if (result.status) {
          setChartData(result.data);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    const fetchMetrics = async () => {
      try {
        const response = await fetch(API_BASE_URL + "/users/admin/metrics", {
          credentials: "include",
        });
        const result = await response.json();
        if (result.status) {
          setMetrics(result.data);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchChartData();
    fetchMetrics();
  }, []);

  return (
    <div className="container mx-auto min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {greeting}, {user?.firstName}
          </h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.totalUsers - chartData[chartData.length - 2]?.users}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active workspaces
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalWorkspaces}</div>
            <p className="text-xs text-muted-foreground">
              +
              {metrics.totalWorkspaces -
                chartData[chartData.length - 2]?.workspaces}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              +
              {metrics.totalProjects -
                chartData[chartData.length - 2]?.projects}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.totalIssues - chartData[chartData.length - 2]?.issues}{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User chart</CardTitle>
            <CardDescription>12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="users" radius={8} fill="var(--color-users)">
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace chart</CardTitle>
            <CardDescription>12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="workspaces"
                  radius={8}
                  fill="var(--color-workspaces)"
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project chart</CardTitle>
            <CardDescription>12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="projects" radius={8} fill="var(--color-projects)">
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue chart</CardTitle>
            <CardDescription>12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="issues" radius={8} fill="var(--color-issues)">
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
