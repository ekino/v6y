'use client';

import { ThemeProvider, ThemeProviderProps } from '@v6y/shared-ui';

import QueryProvider from './QueryProvider';

export const AppProvider = ({ theme, children }: ThemeProviderProps) => {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryProvider>
    );
};
