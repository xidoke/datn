import React, { useEffect, useRef, useState } from "react";
import { Tooltip2 } from "@blueprintjs/popover2";
import { cn } from "@/lib/utils";
// helpers

export type TPosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "auto"
  | "auto-end"
  | "auto-start"
  | "bottom-left"
  | "bottom-right"
  | "left-bottom"
  | "left-top"
  | "right-bottom"
  | "right-top"
  | "top-left"
  | "top-right";

interface ITooltipProps {
  tooltipHeading?: string;
  tooltipContent: string | React.ReactNode;
  position?: TPosition;
  children: JSX.Element;
  disabled?: boolean;
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  isMobile?: boolean;
  renderByDefault?: boolean;
}

export const Tooltip: React.FC<ITooltipProps> = ({
  tooltipHeading,
  tooltipContent,
  position = "top",
  children,
  disabled = false,
  className = "",
  openDelay = 200,
  closeDelay,
  isMobile = false,
  renderByDefault = true, //FIXME: tooltip should always render on hover and not by default, this is a temporary fix
}) => {
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  const [shouldRender, setShouldRender] = useState(renderByDefault);

  const onHover = () => {
    setShouldRender(true);
  };

  useEffect(() => {
    const element = toolTipRef.current as any;

    if (!element) return;

    element.addEventListener("mouseenter", onHover);

    return () => {
      element?.removeEventListener("mouseenter", onHover);
    };
  }, [toolTipRef, shouldRender]);

  if (!shouldRender) {
    return (
      <div ref={toolTipRef} className="flex h-full items-center">
        {children}
      </div>
    );
  }

  return (
    <Tooltip2
      disabled={disabled}
      hoverOpenDelay={openDelay}
      hoverCloseDelay={closeDelay}
      content={
        <div
          className={cn(
            "text-custom-text-200 relative z-50 block max-w-xs gap-1 overflow-hidden break-words rounded-md bg-background p-2 text-xs shadow-md",
            {
              hidden: isMobile,
            },
            className,
          )}
        >
          {tooltipHeading && (
            <h5 className="text-custom-text-100 font-medium">
              {tooltipHeading}
            </h5>
          )}
          {tooltipContent}
        </div>
      }
      position={position}
      renderTarget={({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isOpen: isTooltipOpen,
        ref: eleReference,
        ...tooltipProps
      }) =>
        React.cloneElement(children, {
          ref: eleReference,
          ...tooltipProps,
          ...children.props,
        })
      }
    />
  );
};
