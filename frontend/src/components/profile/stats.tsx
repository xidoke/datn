
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const Stats = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      {[
        { label: "Issues assigned", value: data?.stats.assignedCount },
        { label: "Issues overdue", value: data?.stats.overdueCount },
        { label: "Issues created", value: data?.stats.createdCount },
        { label: "Issues completed", value: data?.stats.completedCount },
      ].map((stat) => (
        <Card key={stat.label} className="p-6">
          {isLoading ? (
            <Skeleton className="mb-2 h-8 w-20" />
          ) : (
            <h3 className="mb-2 text-3xl font-bold">{stat.value}</h3>
          )}
          <p className="text-muted-foreground">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
};

export default Stats;
