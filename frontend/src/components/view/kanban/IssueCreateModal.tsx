"use client";

import * as React from "react";
import { Calendar, Users, Tag, Link, Clock, Layout } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useIssueStore } from "../../../app/kanban/_stores/issueStore";
import { useProjectStateStore } from "../../../app/kanban/_stores/projectStateStore";
import { useProjectLabelStore } from "../../../app/kanban/_stores/projectLabelStore";
import { State, Label as LabelType } from "../../../app/kanban/_types/kanban";
import { LabelSelect } from "./LabelSelect";
import { Checkbox } from "@/components/ui/checkbox";

interface IssueCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedState?: State;
}

interface FormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  stateId: string;
  labels: string[];
}

export default function IssueCreateModal({
  isOpen,
  onClose,
  preSelectedState,
}: IssueCreateModalProps) {
  const { addIssue } = useIssueStore();
  const { states } = useProjectStateStore();
  const { labels } = useProjectLabelStore();
  const [createMore, setCreateMore] = React.useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      stateId: preSelectedState?.id || states[0]?.id,
      labels: [],
    },
  });

  const selectedLabels = watch("labels");

  React.useEffect(() => {
    if (preSelectedState) {
      setValue("stateId", preSelectedState.id);
    }
  }, [preSelectedState, setValue]);

  const onSubmit = async (data: FormData) => {
    const state = states.find((s) => s.id === data.stateId);
    if (!state) return;

    const selectedLabels = labels.filter((label) =>
      data.labels.includes(label.id),
    );

    await addIssue({
      title: data.title,
      description: data.description,
      state,
      priority: data.priority,
      labels: selectedLabels,
    });

    if (!createMore) {
      onClose();
    }
    reset();
  };

  const handleLabelToggle = (labelId: string) => {
    const currentLabels = watch("labels");
    const updatedLabels = currentLabels.includes(labelId)
      ? currentLabels.filter((id) => id !== labelId)
      : [...currentLabels, labelId];
    setValue("labels", updatedLabels);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create new issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="Enter issue title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Click to add description"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={preSelectedState?.id}
                onValueChange={(value) => setValue("stateId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                  setValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="grid grid-cols-2 gap-2">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`label-${label.id}`}
                    checked={selectedLabels.includes(label.id)}
                    onCheckedChange={() => handleLabelToggle(label.id)}
                  />
                  <label
                    htmlFor={`label-${label.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button type="button" variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Assignees
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Start date
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Due date
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Cycle
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Layout className="h-4 w-4" />
              Module
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Link className="h-4 w-4" />
              Parent
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={createMore}
                onCheckedChange={setCreateMore}
                id="create-more"
              />
              <Label htmlFor="create-more">Create more</Label>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Discard
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
