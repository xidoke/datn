"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Circle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlignLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useParams } from "next/navigation";
import { State } from "@/types";

const stateGroups = [
  { name: "backlog", label: "Backlog", icon: AlignLeft },
  { name: "unstarted", label: "Unstarted", icon: Clock },
  { name: "started", label: "Started", icon: Circle },
  { name: "completed", label: "Completed", icon: CheckCircle2 },
  { name: "cancelled", label: "Cancelled", icon: XCircle },
];

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

export default function StateSettingsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { states, isLoading, fetchStates, addState, updateState, deleteState } =
    useProjectStateStore();

  useEffect(() => {
    fetchStates(projectId);
  }, [fetchStates, projectId]);

  const [editingState, setEditingState] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingColor, setEditingColor] = useState("");
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null);

  const handleStartEdit = (state: State) => {
    setEditingState(state.id);
    setEditingName(state.name);
    setEditingDescription(state.description || "");
    setEditingColor(state.color);
  };

  const handleAddState = (group: string) => {
    setAddingToGroup(group);
    setEditingName("");
    setEditingDescription("");
    setEditingColor(getRandomColor());
  };

  const handleUpdateState = async (id: string | null) => {
    if (editingName.trim()) {
      if (
        states.some(
          (state) =>
            state.name.toLowerCase() === editingName.toLowerCase() &&
            (addingToGroup || state.id !== id),
        )
      ) {
        toast({
          title: "Error",
          description: "State name must be unique.",
          variant: "destructive",
        });
        return;
      }

      try {
        if (addingToGroup) {
          await addState({
            name: editingName,
            color: editingColor,
            group: addingToGroup,
            description: editingDescription,
          });
          setAddingToGroup(null);
        } else if (id) {
          await updateState(id, {
            name: editingName,
            color: editingColor,
            description: editingDescription,
          });
          setEditingState(null);
        }
        setEditingName("");
        setEditingDescription("");
        setEditingColor("");
      } catch {
        toast({
          title: "Error",
          description: "Failed to update state. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setEditingState(null);
    setAddingToGroup(null);
    setEditingName("");
    setEditingDescription("");
    setEditingColor("");
  };

  const handleDeleteState = async (id: string, group: string) => {
    const state = states.find((s) => s.id === id);
    if (state?.isDefault) {
      toast({
        title: "Error",
        description: "Cannot delete the default state.",
        variant: "destructive",
      });
      return;
    }

    const groupStates = states.filter((s) => s.group === group);
    if (groupStates.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot have an empty group.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteState(id);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete state. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateState(id, { isDefault: true });
      toast({
        title: "Success",
        description: "Default state updated successfully.",
      });
    } catch{
      toast({
        title: "Error",
        description: "Failed to set default state. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRandomColor = () => {
    const availableColors = PRESET_COLORS.filter(
      (color) => !states.some((state) => state.color === color),
    );
    return availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
  };

  const renderStateItem = (state: State, isEditing: boolean) => {
    const GroupIcon =
      stateGroups.find((group) => group.name === state.group)?.icon || Circle;
    // const isAddingNew = addingToGroup === state.group;

    return (
      <div
        key={state.id}
        className="group flex items-center justify-between rounded-md border border-border p-2"
      >
        <div className="flex flex-1 items-center gap-2">
          {isEditing ? (
            <>
              <Popover>
                <PopoverTrigger>
                  <div
                    className="h-4 w-4 cursor-pointer rounded-full"
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
              <div className="flex-1 space-y-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-8"
                  placeholder="State name"
                  autoFocus
                />
                <Textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Description"
                  className="min-h-[60px] text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <GroupIcon className="h-4 w-4" style={{ color: state.color }} />
              <div className="flex flex-col">
                <span>{state.name}</span>
                {state.description && (
                  <span className="text-sm text-muted-foreground">
                    {state.description}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleUpdateState(state.id)}>
                Update
              </Button>
            </>
          ) : (
            <div className="flex items-center">
              {state.isDefault ? (
                <span className="mr-2 text-sm text-muted-foreground">
                  Default
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => handleSetDefault(state.id)}
                >
                  Mark as default
                </Button>
              )}
              <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleStartEdit(state)}
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
                    {!state.isDefault && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteState(state.id, state.group)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">States</h1>

      <div className="space-y-4">
        {stateGroups.map((group) => {
          const groupStates = states.filter(
            (state) => state.group === group.name,
          );

          return (
            <Card key={group.name}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{group.label}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAddState(group.name)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupStates.map((state) =>
                    renderStateItem(state, editingState === state.id),
                  )}
                  {addingToGroup === group.name && (
                    <div className="flex items-center justify-between rounded-md border border-border p-2">
                      <div className="flex flex-1 items-center gap-2">
                        <Popover>
                          <PopoverTrigger>
                            <div
                              className="h-4 w-4 cursor-pointer rounded-full"
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
                                onChange={(e) =>
                                  setEditingColor("#" + e.target.value)
                                }
                                className="h-8"
                                maxLength={6}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <div className="flex-1 space-y-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8"
                            placeholder="State name"
                            autoFocus
                          />
                          <Textarea
                            value={editingDescription}
                            onChange={(e) =>
                              setEditingDescription(e.target.value)
                            }
                            placeholder="Description"
                            className="min-h-[60px] text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateState(null)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
