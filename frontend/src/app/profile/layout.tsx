"use client";
import { User, Shield, Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppRouter } from "@/hooks/use-app-router";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useAppRouter();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6 w-full justify-start gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <h2 className="mb-6 text-lg font-semibold">Settings</h2>
          <div className="space-y-2">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Link href="/settings/profile">
                <User size={16} />
                Profile
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Link href="/settings/security">
                <Shield size={16} />
                Security
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Link href="/settings/activity">
                <Activity size={16} />
                Activity
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
