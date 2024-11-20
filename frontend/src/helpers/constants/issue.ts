import { Calendar, GanttChartSquare, Kanban, List, Sheet } from "lucide-react";

export enum IssueLayoutTypes {
  LIST = "list",
  KANBAN = "kanban",
  CALENDAR = "calendar",
  GANTT = "gantt_chart",
  SPREADSHEET = "spreadsheet",
}

export const ISSUE_LAYOUT_MAP = {
  [IssueLayoutTypes.LIST]: { key: IssueLayoutTypes.LIST, title: "List layout", label: "List", icon: List },
  [IssueLayoutTypes.KANBAN]: { key: IssueLayoutTypes.KANBAN, title: "Board layout", label: "Board", icon: Kanban },
  [IssueLayoutTypes.CALENDAR]: {
    key: IssueLayoutTypes.CALENDAR,
    title: "Calendar layout",
    label: "Calendar",
    icon: Calendar,
  },
  [IssueLayoutTypes.SPREADSHEET]: {
    key: IssueLayoutTypes.SPREADSHEET,
    title: "Table layout",
    label: "Table",
    icon: Sheet,
  },
  [IssueLayoutTypes.GANTT]: {
    key: IssueLayoutTypes.GANTT,
    title: "Timeline layout",
    label: "Timeline",
    icon: GanttChartSquare,
  },
};

export const ISSUE_LAYOUTS: {
  key: IssueLayoutTypes;
  title: string;
  icon: any;
}[] = Object.values(ISSUE_LAYOUT_MAP);