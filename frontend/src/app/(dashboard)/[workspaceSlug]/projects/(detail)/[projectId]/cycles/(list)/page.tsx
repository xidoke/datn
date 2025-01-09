"use client";

import { CyclesList } from "@/components/view/list/cycle/root";
import { useCycleStore } from "@/stores/cycleStore";
import { useParams } from "next/navigation";

const CycleListPage = () => {
  const { workspaceSlug, projectId } = useParams();
  const {
    cycles,
    completedCycleIds: compeletedCycleIds,
    upcomingCycleIds,
  } = useCycleStore();
  const cycleIds = Object.keys(cycles);

  return (
    <div className="min-h-screen bg-background">
      <CyclesList
        completedCycleIds={compeletedCycleIds}
        upcomingCycleIds={upcomingCycleIds}
        cycleIds={cycleIds}
        workspaceSlug={workspaceSlug as string}
        projectId={projectId as string}
      />
    </div>
  );
};
export default CycleListPage;
