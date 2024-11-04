"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectLabel {
  id: string;
  name: string;
  color: string;
}

const defaultLabels: ProjectLabel[] = [
  { id: "1", name: "Planning", color: "#00B341" },
  { id: "2", name: "Bug", color: "#F04438" },
  { id: "3", name: "Task", color: "#F79009" },
  { id: "4", name: "Feature", color: "#6941C6" },
  { id: "5", name: "Enhancement", color: "#00B341" },
  { id: "6", name: "Design", color: "#9B8AFB" },
  { id: "7", name: "Development", color: "#F04438" },
  { id: "8", name: "Testing", color: "#F79009" },
  { id: "9", name: "Deployment", color: "#6941C6" },
  { id: "10", name: "Frontend", color: "#00B341" },
  { id: "11", name: "Backend", color: "#9B8AFB" },
  { id: "12", name: "Database", color: "#00B341" },
];

export default function LabelsPage() {
  const [labels, setLabels] = useState<ProjectLabel[]>(defaultLabels);
  const [isAddingLabel, setIsAddingLabel] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Labels</h1>
        <Dialog open={isAddingLabel} onOpenChange={setIsAddingLabel}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add label
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new label</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Label name</Label>
                <Input id="name" placeholder="Enter label name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" type="color" />
              </div>
              <Button
                className="w-full"
                onClick={() => setIsAddingLabel(false)}
              >
                Create label
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-2">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center gap-2 rounded-md border bg-card p-2"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span>{label.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
