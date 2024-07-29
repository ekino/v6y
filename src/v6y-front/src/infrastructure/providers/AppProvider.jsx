'use client';

import ThemeProvider from './ThemeProvider.jsx';
import QueryProvider from './QueryProvider.jsx';

export function AppProvider({ theme, children }) {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryProvider>
    );
}
