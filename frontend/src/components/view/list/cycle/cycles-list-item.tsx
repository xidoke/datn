"use client";

import { FC, MouseEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, MoreHorizontal } from "lucide-react";
import { generateQueryParams } from "@/helpers/router.helper";
import { useCycleStore } from "@/stores/cycleStore";
import { useAppRouter } from "@/hooks/use-app-router";
import { CircularProgressIndicator } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/helpers/common.helper";
import { DeleteCycleDialog } from "@/components/cycle/delete-cycle-dialog";
import React from "react";
import UpdateCycleModal from "@/components/cycle/edit-cycle.dialog";
import useSWR from "swr";
import { Tooltip } from "@/components/ui/tooltip-plane";

type TCyclesListItem = {
  cycleId: string;
  handleEditCycle?: () => void;
  handleDeleteCycle?: () => void;
  handleAddToFavorites?: () => void;
  handleRemoveFromFavorites?: () => void;
  workspaceSlug: string;
  projectId: string;
  className?: string;
  isCompleted?: boolean;
};

export const CyclesListItem: FC<TCyclesListItem> = (props) => {
  const { cycleId, workspaceSlug, projectId, isCompleted = false } = props;
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const { getCycleById, updateCycle, fetchCycleProgress } = useCycleStore();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = React.useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = React.useState(false);
  const handleUpdateDateRange = async (range: DateRange | undefined) => {
    try {
      await updateCycle(workspaceSlug, projectId, cycleId, {
        startDate: range?.from?.toISOString() || undefined,
        dueDate: range?.to?.toISOString() || undefined,
      });
      toast({
        title: "Success",
        description: "Cycle date range updated successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const cycleDetails = getCycleById(cycleId);


  // Fetch cycle progress
  const { data } = useSWR("WORKSPACE_CYCLES_PROGRESS_" + cycleId, () =>
    fetchCycleProgress(workspaceSlug, projectId, cycleId),
  );
  if (!cycleDetails) return null;
  const progress = data || 0;
  const handleItemClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const query = generateQueryParams(searchParams, ["peekCycle"]);
    router.push(
      `/${workspaceSlug}/projects/${projectId}/cycles/${cycleId}?${query}`,
    );
  };

  return (
    <>
      <div
        onClick={handleItemClick}
        className="group flex cursor-pointer items-center gap-4 border-b border-sidebar-border bg-background px-4 py-3 transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-4 truncate">
          <span className="flex flex-shrink-0 items-center">
            <CircularProgressIndicator
              size={30}
              percentage={progress}
              strokeWidth={3}
            >
              {isCompleted ? (
                progress === 100 ? (
                  <Check className="h-3 w-3 stroke-[2] text-primary" />
                ) : (
                  <span className="text-sm text-destructive">{`!`}</span>
                )
              ) : progress === 100 ? (
                <Check className="h-3 w-3 stroke-[2] text-primary" />
              ) : (
                <span className="text-[9px] text-destructive">{`${progress}%`}</span>
              )}
            </CircularProgressIndicator>
          </span>
          <Tooltip tooltipContent={cycleDetails.title} position="top">
            <span className="truncate text-sm">{cycleDetails.title}</span>
          </Tooltip>
        </div>

        <div className="min-w-0 flex-1">
          <Tooltip tooltipContent={cycleDetails.description} position="top">
            <h3 className="truncate text-sm">{cycleDetails.description}</h3>
          </Tooltip>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DateRangePicker
              from={
                cycleDetails.startDate
                  ? new Date(cycleDetails.startDate)
                  : undefined
              }
              to={
                cycleDetails.dueDate
                  ? new Date(cycleDetails.dueDate)
                  : undefined
              }
              onSelect={handleUpdateDateRange}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            {/* avatar of creator */}

            <Avatar className="h-6 w-6">
              <AvatarImage
                src={API_BASE_URL + cycleDetails?.creator?.avatarUrl}
                alt={cycleDetails.creator?.email}
                title={"creator: " + cycleDetails?.creator?.email}
              />
              <AvatarFallback>
                {cycleDetails?.creator?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpenEditDialog(true);
                  }}
                >
                  Edit cycle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpenDeleteDialog(true);
                  }}
                >
                  Delete cycle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <DeleteCycleDialog
        cycle={cycleDetails}
        workspaceSlug={workspaceSlug as string}
        projectId={projectId as string}
        isOpen={isOpenDeleteDialog}
        handleClose={() => setIsOpenDeleteDialog(false)}
      />
      <UpdateCycleModal
        cycle={cycleDetails}
        isOpen={isOpenEditDialog}
        onClose={() => setIsOpenEditDialog(false)}
        onSubmit={(data) => {
          updateCycle(workspaceSlug, projectId, cycleId, data);
          setIsOpenEditDialog(false);
        }}
      />
    </>
  );
};
