import React from "react";
// styles
import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { AppProvider } from "./provider";

export const metadata: Metadata = {
  title: "Xidok - Next.js",
  description: "Xidok - Next.js",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.className,
          )}
        >
          <AppProvider>{children}</AppProvider>
        </body>
      </html>
    </>
  );
}
