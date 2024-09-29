'use client';

import { AppProviderProps } from '@/infrastructure/providers/ThemeType';

import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';

export function AppProvider({ theme, children }: AppProviderProps) {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryProvider>
    );
}
