"use client";
import { Button } from "@/components/ui/button";
// hooks
// import { useAppRouter } from "@/hooks/use-app-router";
// layouts
import DefaultLayout from "@/layouts/default-layout";

export default function CustomErrorComponent() {
  //   const router = useAppRouter();
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {};

  return (
    <DefaultLayout>
      <div
        className={`bg-custom-background-100 h-screen w-full overflow-hidden`}
      >
        <div className="grid h-full place-items-center p-4">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Yikes! That doesn{"'"}t look good.
              </h3>
              <p className="text-custom-text-200 mx-auto text-sm md:w-1/2">
                That crashed Xidok, pun intended. No worries, though. Our
                engineers have been notified. If you have more details, please
                write to{" "}
                <a
                  href="mailto:support@do.pd200154@sis.hust.edu.vn"
                  className="text-custom-primary"
                >
                  Do.pd200154@sis.hust.edu.vn
                </a>{" "}
                or on our{" "}
                <a
                  href="https://discord.com/invite/A92xrEGCge"
                  target="_blank"
                  className="text-custom-primary"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
                .
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button variant="default" size="default" onClick={handleRefresh}>
                Refresh
              </Button>
              <Button variant="outline" size="default" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
