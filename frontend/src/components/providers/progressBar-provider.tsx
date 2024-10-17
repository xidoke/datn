'use client';
import * as React from 'react';

import { AppProgressBar } from '@/lib/n-progress';

export function ProgressBarProvider() {
  return (
    <>
      <AppProgressBar
        height="4px"
        color={'hsl(284 80% 44%)'}
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
