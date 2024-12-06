import { TIssuePriorities } from "@/types";
import { Ban, SignalHigh } from "lucide-react";

export const PriorityIcon = ({ priority }: { priority: TIssuePriorities }) => {
  switch (priority) {
    case "4":
      return <SignalHigh className="h-3 w-3 text-red-600" />;
    case "3":
      return <SignalHigh className="h-3 w-3 text-orange-500" />;
    case "2":
      return <SignalHigh className="h-3 w-3 text-yellow-500" />;
    case "1":
      return <SignalHigh className="h-3 w-3 text-blue-500" />;
    default:
      return <Ban className="h-3 w-3 text-gray-400" />;
  }
};
