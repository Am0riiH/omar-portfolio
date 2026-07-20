'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

/** Thin wrapper that re-exports next-themes' provider with the project's
 *  standard 'use client' boundary so layout.tsx can stay a Server Component. */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
