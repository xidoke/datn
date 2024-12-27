"use client";

import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SettingWorkspaceHeader from "./header";
import { ContentWrapper } from "@/components/content-wrapper";

const settingsNavItems = [
  { name: "General", href: "" },
  { name: "Members", href: "members/" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  return (
    <>
      <SettingWorkspaceHeader />
      <ContentWrapper>
        <div className="vertical-scrollbar scrollbar-lg inset-y-0 flex h-full w-full flex-row overflow-y-auto bg-background">
          <aside className="hidden flex-shrink-0 overflow-y-hidden px-page-x py-page-y !pr-0 sm:hidden md:block lg:block">
            <div className="flex w-[280px] flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-sidebar-accent-foreground">
                  SETTINGS
                </span>
                <div className="flex w-full flex-col gap-1">
                  {settingsNavItems.map((item) => {
                    const itemPath = `/${params.workspaceSlug}/settings/${item.href ? item.href : ""}`;
                    const isActive = pathname.endsWith(itemPath);
                    return (
                      <Link
                        key={item.href}
                        href={itemPath}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm font-medium",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
          <main className="relative flex w-full flex-col overflow-hidden">
            <div className="vertical-scrollbar scrollbar-md h-full w-full overflow-x-hidden overflow-y-scroll px-page-x py-page-y md:px-9">
              {children}
            </div>
          </main>
        </div>
      </ContentWrapper>
    </>
  );
}
