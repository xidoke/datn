import React from "react";

import { cn } from "@/lib/utils";
import { Tooltip } from "../tooltip-plane";


type Props = {
  data: any;
  noTooltip?: boolean;
  inPercentage?: boolean;
  size?: "sm" | "md" | "lg";
};

export const LinearProgressIndicator: React.FC<Props> = ({
  data,
  noTooltip = false,
  inPercentage = false,
  size = "sm",
}) => {
  const total = data.reduce((acc: any, cur: any) => acc + cur.value, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let progress = 0;

  const bars = data.map((item: any) => {
    const width = `${(item.value / total) * 100}%`;
    if (width === "0%") return <></>;
    const style = {
      width,
      backgroundColor: item.color,
    };
    progress += item.value;
    if (noTooltip) return <div style={style} key={item.id} />;
    else
      return (
        <Tooltip key={item.id} tooltipContent={`${item.name} ${Math.round(item.value)}${inPercentage ? "%" : ""}`}>
          <div style={style} className="first:rounded-l-sm last:rounded-r-sm" />
        </Tooltip>
      );
  });

  return (
    <div
      className={cn("flex w-full items-center justify-between gap-[1px] rounded-sm", {
        "h-2": size === "sm",
        "h-3": size === "md",
        "h-3.5": size === "lg",
      })}
    >
      {total === 0 ? (
        <div className="flex h-full w-full gap-[1.5px] p-[2px] bg-custom-background-90 rounded-sm">{bars}</div>
      ) : (
        <div className="flex h-full w-full gap-[1.5px] p-[2px] bg-custom-background-90 rounded-sm">{bars}</div>
      )}
    </div>
  );
};
