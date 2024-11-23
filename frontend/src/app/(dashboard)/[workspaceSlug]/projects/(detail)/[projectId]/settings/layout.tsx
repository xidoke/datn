"use client";

import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const settingsNavItems = [
  { name: "General", href: "" },
  { name: "Labels", href: "labels/" },
  { name: "States", href: "states/" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  return (
    <div className="container mx-auto flex min-h-screen gap-8 p-6">
      <aside className="w-40 space-y-1 border-r-2 border-sidebar-border pr-2">
        <div className="mb-4 px-2 text-sm font-medium text-muted-foreground">
          SETTINGS
        </div>
        {settingsNavItems.map((item) => {
          const itemPath = `/${params.workspaceSlug}/projects/${params.projectId}/settings/${item.href ? item.href : ""}`;
          const isActive = pathname.endsWith(itemPath);

          return (
            <Link
              key={item.href}
              href={itemPath}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
