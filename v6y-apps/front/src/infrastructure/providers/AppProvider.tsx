'use client';

import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';
import { AppProviderProps } from './ThemeType';

export function AppProvider({ theme, children }: AppProviderProps) {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryProvider>
    );
}
