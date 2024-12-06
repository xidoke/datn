"use client"
import CalendarView from "@/components/view/calendar/calendar-view";
import KanbanBoard from "@/components/view/kanban/KanbanBoard";
import ListView from "@/components/view/list/list-view";
import { IssueLayoutTypes } from "@/helpers/constants/issue";
import { useCycleStore } from "@/stores/cycleStore"
import useIssueStore from "@/stores/issueStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useViewStore } from "@/stores/viewStore";
import { useParams } from "next/navigation";

const CycleDetailsPage = () => {
  const { cycleId } = useParams();
  const { getCycleById } = useCycleStore();
  const { issues } = useIssueStore();
  const { states } = useProjectStateStore()
  const { labels } = useProjectLabelStore();
  const { viewType } = useViewStore();
  
  const cycle = getCycleById(cycleId as string);

  if (!cycle) {
    return <div>Cycle not found</div>
  }

  const issuesOfCycle = issues.filter(issue => issue.cycleId === cycleId);



  switch (viewType) {
    case IssueLayoutTypes.KANBAN:
      return (
        <main className="min-h-screen">
          <KanbanBoard issues={issuesOfCycle} states={states} labels={labels} />
        </main>
      );
    case IssueLayoutTypes.CALENDAR:
      return (
        <main className="min-h-screen">
          <CalendarView
            issues={issuesOfCycle}
            labels={labels}
            states={states}
          />
        </main>
      );

    case IssueLayoutTypes.LIST:
      return (
        <main className="min-h-screen">
          <ListView
            issues={issuesOfCycle}
            states={states}
            labels={labels}
            onIssueClick={() => {}}
          />
        </main>
      );
  }
  return <main className="min-h-screen">This view is not supported now</main>;
}
export default CycleDetailsPage 