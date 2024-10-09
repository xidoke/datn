'use client';
import * as React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { TooltipProvider } from './ui/tooltip';
import { AppProgressBar } from '@/lib/n-progress';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      <AppProgressBar
        height="4px"
        color={'hsl(284 80% 44%)'}
        options={{ showSpinner: false }}
        shallowRouting
      />
      <JotaiProvider>
        <NextThemesProvider {...props}>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </NextThemesProvider>
      </JotaiProvider>
    </>
  );
}
