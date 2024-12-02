import { ResponsivePie } from "@nivo/pie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IssuesByGroupData {
  group: string;
  count: number;
}

interface IssuesByStatePieChartProps {
  data: IssuesByGroupData[];
}

export function IssuesByStatePieChart({ data }: IssuesByStatePieChartProps) {
  const chartData = data.map((item) => ({
    id: item.group,
    label: item.group,
    value: item.count,
    // random color
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
  }));

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle>Issues by group state</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="hsl(var(--foreground))"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "hsl(var(--foreground))",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "hsl(var(--primary))",
                  },
                },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
