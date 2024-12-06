"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedContentProps {
  content: string;
  maxLength?: number;
  maxWidth?: number;
  className?: string;
}

export const TruncatedContent: React.FC<TruncatedContentProps> = ({
  content,
  maxLength,
  maxWidth,
  className = "",
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        if (maxWidth) {
          setIsTruncated(
            contentRef.current.scrollWidth > contentRef.current.clientWidth,
          );
        } else if (maxLength) {
          setIsTruncated(content.length > maxLength);
        }
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);

    return () => {
      window.removeEventListener("resize", checkTruncation);
    };
  }, [content, maxLength, maxWidth]);

  const truncatedContent = maxLength
    ? content.slice(0, maxLength) + (content.length > maxLength ? "..." : "")
    : content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={contentRef}
            className={`inline-block ${maxWidth ? `max-w-[${maxWidth}px]` : ""} truncate ${className}`}
            style={{ maxWidth: maxWidth }}
          >
            {truncatedContent}
          </div>
        </TooltipTrigger>
        {isTruncated && (
          <TooltipContent>
            <p className="max-w-xs break-words">{content}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
