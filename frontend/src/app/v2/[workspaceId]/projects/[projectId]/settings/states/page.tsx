"use client";

import { useState } from "react";
import { Plus, GripVertical, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface State {
  id: string;
  name: string;
  group: string;
  color?: string;
}

const defaultStates: State[] = [
  { id: "1", name: "Backlog", group: "Backlog", color: "gray" },
  { id: "2", name: "Todo", group: "Unstarted", color: "blue" },
  { id: "3", name: "In Progress", group: "Started", color: "yellow" },
  { id: "4", name: "Done", group: "Completed", color: "green" },
  { id: "5", name: "Cancelled", group: "Cancelled", color: "red" },
];

const stateGroups = [
  "Backlog",
  "Unstarted",
  "Started",
  "Completed",
  "Cancelled",
];

export default function StatesPage() {
  const [states, setStates] = useState<State[]>(defaultStates);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">States</h1>
      </div>

      <div className="space-y-4">
        {stateGroups.map((group) => (
          <Collapsible key={group}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <h3 className="text-lg font-medium">{group}</h3>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                {states
                  .filter((state) => state.group === group)
                  .map((state) => (
                    <div
                      key={state.id}
                      className="flex items-center gap-2 rounded-md border bg-card p-2"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: state.color,
                        }}
                      />
                      <span>{state.name}</span>
                    </div>
                  ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
