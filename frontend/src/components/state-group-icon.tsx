import { StateGroup } from "@/types";
import { AlignLeft, CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

const stateGroups = [
  { name: "backlog", label: "Backlog", icon: AlignLeft },
  { name: "unstarted", label: "Unstarted", icon: Clock },
  { name: "started", label: "Started", icon: Circle },
  { name: "completed", label: "Completed", icon: CheckCircle2 },
  { name: "cancelled", label: "Cancelled", icon: XCircle },
];

export interface StateGroupIconProps {
  stateGroup: StateGroup;
  color?: string;
  className?: string;
  size?: number;
  
}

const StateGroupIcon = (props: StateGroupIconProps) => {
  const Icon = stateGroups.find(
    (group) => group.name === props.stateGroup,
  )?.icon;
  return Icon ? (
    <Icon
      className={props.className}
      style={{ color: props.color }}
    />
  ) : null;
};
export default StateGroupIcon;
