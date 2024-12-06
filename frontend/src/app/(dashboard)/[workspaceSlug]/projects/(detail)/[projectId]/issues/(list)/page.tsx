"use client";
import CalendarView from "@/components/view/calendar/calendar-view";
import KanbanBoard from "@/components/view/kanban/KanbanBoard";
import { IssueLayoutTypes } from "@/helpers/constants/issue";
import useIssueStore from "@/stores/issueStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useViewStore } from "@/stores/viewStore";

export default function Home() {
  const { issues } = useIssueStore();
  const { states } = useProjectStateStore();
  const { labels } = useProjectLabelStore();
  const { viewType } = useViewStore();
  switch (viewType) {
    case IssueLayoutTypes.KANBAN:
      return (
        <main className="min-h-screen">
          <KanbanBoard issues={issues} states={states} labels={labels} />
        </main>
      );
      break;
    case IssueLayoutTypes.CALENDAR:
      return <main className="min-h-screen">
        <CalendarView issues={issues} labels={labels} states={states} />
      </main>;
      break;
  }
  return <main className="min-h-screen">This view is not supported now</main>;
}
