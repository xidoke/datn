"use client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProgressBar } from "@/lib/n-progress";
import { ThemeProvider } from "next-themes";
import { FC } from "react";
import { SWRConfig } from "swr";

export interface IAppProvider {
  children: React.ReactNode;
}
export const AppProvider: FC<IAppProvider> = (props) => {
  const { children } = props;
  return (
    <>
      {/* n-progress */}
      <AppProgressBar
        height="4px"
        color={"#0A2FFF"}
        options={{ showSpinner: false }}
        shallowRouting
      />
      {/* theme */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* tooltip shadcn-ui */}
        <TooltipProvider delayDuration={0}>
          <SWRConfig
            value={{
              refreshWhenHidden: false,
              revalidateIfStale: true,
              revalidateOnFocus: false,
              revalidateOnMount: true,
              errorRetryCount: 3,
            }}
          >
            <div className="relative flex min-h-screen flex-col bg-background">
              {children}
            </div>
          </SWRConfig>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
};
