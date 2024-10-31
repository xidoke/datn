"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  { name: "General", href: "" },
  { name: "Members", href: "members" },
  { name: "States", href: "states" },
  { name: "Labels", href: "labels" },
];

export default function ProjectSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const currentPath = params.section || "";

  return (
    <div className="container mx-auto flex gap-8 p-6">
      <aside className="w-48 space-y-1">
        <div className="mb-4 px-2 text-sm font-medium text-muted-foreground">
          SETTINGS
        </div>
        {settingsNavItems.map((item) => (
          <Link
            key={item.href}
            href={`/v2/${params.workspaceId}/projects/${params.projectId}/settings/${item.href}`}
            className={cn(
              "block rounded-md px-2 py-1.5 text-sm font-medium",
              currentPath === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {item.name}
          </Link>
        ))}
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
