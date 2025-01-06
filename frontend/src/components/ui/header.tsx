"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Header({ left, right, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b px-4 lg:px-6 bg-sidebar",
        className,
      )}
    >
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
