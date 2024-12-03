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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CreateCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    startDate?: Date;
    dueDate?: Date;
  }) => void;
}

export default function CreateCycleModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCycleModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  );
  const [isDraft, setIsDraft] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onSubmit({
        title,
        description,
        startDate: dateRange?.from,
        dueDate: dateRange?.to,
      });
      onClose();
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // Only update isDraft if both dates are set
    if (range?.from && range?.to) {
      setIsDraft(false);
    }
  };

  const toggleDraft = (checked: boolean) => {
    setIsDraft(checked);
    if (checked) {
      setDateRange(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-yellow-500">🔥</span> Create cycle
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
            <Switch
              id="draft-mode"
              checked={isDraft}
              onCheckedChange={toggleDraft}
            />
            <Label htmlFor="draft-mode">Draft Mode</Label>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <DateRangePicker
              from={dateRange?.from}
              to={dateRange?.to}
              onSelect={handleDateRangeChange}
              className="w-full"
              disabled={isDraft}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !title || (!isDraft && (!dateRange?.from || !dateRange?.to))
              }
            >
              {isDraft ? "Create Draft Cycle" : "Create Cycle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
