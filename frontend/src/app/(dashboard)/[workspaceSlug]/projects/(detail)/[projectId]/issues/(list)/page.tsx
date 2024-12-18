"use client";
import CalendarView from "@/components/view/calendar/calendar-view";
import GanttView from "@/components/view/gantt/GanttView";
import KanbanBoard from "@/components/view/kanban/KanbanBoard";
import ListView from "@/components/view/list/list-view";
import TableView from "@/components/view/table/table-view";
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
    case IssueLayoutTypes.LIST:
      return (
        <main className="min-h-screen">
          <ListView issues={issues} states={states} labels={labels} />
        </main>
      );
    case IssueLayoutTypes.GANTT:
      return (
        <main className="min-h-screen">
          <GanttView issues={issues} states={states} labels={labels} />
        </main>
      );
    case IssueLayoutTypes.SPREADSHEET:
      return (
        <main className="min-h-screen">
          <TableView issues={issues} states={states} labels={labels} />
        </main>
      );
    case IssueLayoutTypes.CALENDAR:
      return (
        <main className="min-h-screen">
          <CalendarView issues={issues} labels={labels} states={states} />
        </main>
      );
  }
  return <main className="min-h-screen">This view is not supported now</main>;
}
