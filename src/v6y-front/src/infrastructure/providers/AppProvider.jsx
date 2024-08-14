'use client';

import QueryProvider from './QueryProvider.jsx';
import ThemeProvider from './ThemeProvider.jsx';

export function AppProvider({ theme, children }) {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryProvider>
    );
}
