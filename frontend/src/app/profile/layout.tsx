"use client";
import { User, Shield, Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppRouter } from "@/hooks/use-app-router";
import { usePathname } from "next/navigation"; // Import usePathname

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useAppRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  const links = [
    { href: "/profile/", label: "Profile", icon: <User size={16} /> },
    {
      href: "/profile/security/",
      label: "Security",
      icon: <Shield size={16} />,
    },
    {
      href: "/profile/activity/",
      label: "Activity",
      icon: <Activity size={16} />,
    },
  ];

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
          <Button
            variant="ghost"
            className="mb-6 w-full justify-start gap-2"
          >
            <Link 
            href={"/"}>
              Go to workspace
            </Link>
          </Button>
          <h2 className="mb-6 text-lg font-semibold">Settings</h2>
          <div className="space-y-2">
            {links.map((link) => (
              <Button
                asChild
                key={link.href}
                variant="ghost"
                className={`w-full justify-start gap-2 ${
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`} // Thêm lớp active
              >
                <Link href={link.href}>
                  {link.icon}
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
