"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  { name: "General", href: "general" },
  { name: "Members", href: "members" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const currentPath = params.section || "general";

  return (
    <div className="container mx-auto flex gap-8 p-6">
      <aside className="w-64 space-y-1">
        <div className="mb-4 px-2 text-sm font-medium text-muted-foreground">
          SETTINGS
        </div>
        {settingsNavItems.map((item) => (
          <Link
            key={item.href}
            href={`/v2/${params.workspaceId}/settings/${item.href}`}
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
