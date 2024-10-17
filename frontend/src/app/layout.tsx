import React from 'react';
import './globals.css';
import { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { fontSans } from '@/lib/fonts';
import { Toaster } from '@/components/ui/toaster';
import { ProgressBarProvider } from '@/components/providers/progressBar-provider';

export const metadata: Metadata = {
  title: 'Xidoke - Next.js',
  description: 'Xidoke - Next.js',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
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
            'min-h-screen bg-background font-sans antialiased',
            fontSans.className
          )}
        >
          <ProgressBarProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div vaul-drawer-wrapper="">
              <div className="relative flex min-h-screen flex-col bg-background">
                {children}
              </div>
            </div>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
