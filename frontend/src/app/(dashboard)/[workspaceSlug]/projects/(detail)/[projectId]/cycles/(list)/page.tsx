"use client"

import { CyclesList } from "@/components/view/list/cycle/root";
import { useCycleStore } from "@/stores/cycleStore";
import { useParams } from "next/navigation";

const CycleListPage = (

) => {
    const { workspaceSlug, projectId, cycleId } = useParams();
    const { cycles, createCycle } = useCycleStore();
    const cycleIds = Object.keys(cycles);

  return (
    <div>
        <h1>Cycles: {cycleIds.join('')}</h1>
        <CyclesList 
        completedCycleIds={['1']}
        cycleIds={cycleIds}
        workspaceSlug={workspaceSlug as string}
        projectId={projectId as string}
        />
    </div>
  )
}
export default CycleListPage