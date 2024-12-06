"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ICycle } from "@/types/cycle";

interface UpdateCycleModalProps {
  isOpen: boolean;
  cycle: ICycle;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    startDate?: string;
    dueDate?: string;
  }) => void;
}

export default function UpdateCycleModal({
  isOpen,
  onClose,
  onSubmit,
  cycle
}: UpdateCycleModalProps) {
  const [title, setTitle] = React.useState(cycle.title);
  const [description, setDescription] = React.useState(cycle.description || "");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    {
        from: cycle.startDate ? new Date(cycle.startDate) : undefined,
        to: cycle.dueDate ? new Date(cycle.dueDate) : undefined
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onSubmit({
        title,
        description,
        startDate:dateRange?.from ? dateRange?.from?.toISOString() : undefined,
        dueDate:dateRange?.to ? dateRange?.to?.toISOString() : undefined,
      });
      onClose();
    }
  };




  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-yellow-500">🔥</span> Update cycle
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0"
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] border-0"
          />
          <div className="flex items-center space-x-2">
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <DateRangePicker
              from={dateRange?.from}
              to={dateRange?.to}
              onSelect={setDateRange}
              className="w-full"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
