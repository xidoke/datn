import { StateGroupIcon } from "./state-group-icon";

export interface IStateGroupIcon {
  className?: string;
  color?: string;
  stateGroup: TStateGroups;
  height?: string;
  width?: string;
}

export type TStateGroups =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "cancelled";

export const STATE_GROUP_COLORS: {
  [key in TStateGroups]: string;
} = {
  backlog: "#d9d9d9",
  unstarted: "#3f76ff",
  started: "#f59e0b",
  completed: "#16a34a",
  cancelled: "#dc2626",
};

export const stateGroups = [
  "backlog",
  "unstarted",
  "started",
  "completed",
  "cancelled",
].map((name) => ({
  name,
  label: name.charAt(0).toUpperCase() + name.slice(1), // Viết hoa chữ cái đầu
  icon: (props: IStateGroupIcon) => (
    <StateGroupIcon {...props} stateGroup={name as TStateGroups} />
  ),
}));

export const PRESET_COLORS = [
  "#ff6b00",
  "#ffa800",
  "#4bce97",
  "#00c7b0",
  "#62b0fd",
  "#0055cc",
  "#95a5a6",
  "#e5484d",
  "#ff8fab",
  "#9333ea",
  "#666666",
];
