"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectLabelStore } from "@/stores/projectLabelStore";
import { useParams } from "next/navigation";
import { Label } from "@/types";

const PRESET_COLORS = [
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

export default function LabelSettingsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const workspaceSlug = params.workspaceSlug as string;
  const { labels, fetchLabels, addLabel, updateLabel, deleteLabel } =
    useProjectLabelStore();

  useEffect(() => {
    fetchLabels(workspaceSlug, projectId);
  }, [fetchLabels, workspaceSlug, projectId]);

  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleStartEdit = (label: Label) => {
    setEditingLabel(label.id);
    setEditingName(label.name);
    setEditingColor(label.color);
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingName("");
    setEditingColor(getRandomColor());
  };

  const handleSave = async () => {
    if (!editingName.trim()) {
      toast({
        title: "Error",
        description: "Label name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (
      labels.some(
        (label) =>
          label.name.toLowerCase() === editingName.toLowerCase() &&
          (isAddingNew || label.id !== editingLabel),
      )
    ) {
      toast({
        title: "Error",
        description: "Label name must be unique",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isAddingNew) {
        await addLabel(workspaceSlug, projectId, {
          name: editingName,
          color: editingColor,
        });
        setIsAddingNew(false);
      } else if (editingLabel) {
        await updateLabel(workspaceSlug, projectId, editingLabel, {
          name: editingName,
          color: editingColor,
        });
        setEditingLabel(null);
      }
      setEditingName("");
      setEditingColor("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to save label. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingLabel(null);
    setIsAddingNew(false);
    setEditingName("");
    setEditingColor("");
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await deleteLabel(workspaceSlug, projectId, id);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete label. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRandomColor = () => {
    const availableColors = PRESET_COLORS.filter(
      (color) => !labels.some((label) => label.color === color),
    );
    return availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
  };

  const renderLabelItem = (label: Label, isEditing: boolean) => (
    <div
      key={label.id}
      className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-secondary/50"
    >
      <div className="flex flex-1 items-center gap-3">
        {isEditing ? (
          <>
            <Popover>
              <PopoverTrigger>
                <div
                  className="h-3 w-3 cursor-pointer rounded-full"
                  style={{ backgroundColor: editingColor }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="mb-2 grid grid-cols-7 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <div
                      key={color}
                      className="h-6 w-6 cursor-pointer rounded"
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingColor(color)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span>#</span>
                  <Input
                    value={editingColor.replace("#", "")}
                    onChange={(e) => setEditingColor("#" + e.target.value)}
                    className="h-8"
                    maxLength={6}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="h-8 flex-1"
              autoFocus
            />
          </>
        ) : (
          <>
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="text-sm">{label.name}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleStartEdit(label)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDeleteLabel(label.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col space-y-6 bg-background p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Labels</h1>
        <Button onClick={handleStartAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add label
        </Button>
      </div>

      <div className="space-y-1">
        {labels.map((label) =>
          renderLabelItem(label, editingLabel === label.id),
        )}
        {isAddingNew && (
          <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
            <div className="flex flex-1 items-center gap-3">
              <Popover>
                <PopoverTrigger>
                  <div
                    className="h-3 w-3 cursor-pointer rounded-full"
                    style={{ backgroundColor: editingColor }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="mb-2 grid grid-cols-7 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <div
                        key={color}
                        className="h-6 w-6 cursor-pointer rounded"
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>#</span>
                    <Input
                      value={editingColor.replace("#", "")}
                      onChange={(e) => setEditingColor("#" + e.target.value)}
                      className="h-8"
                      maxLength={6}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="h-8 flex-1"
                placeholder="Enter label name"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
