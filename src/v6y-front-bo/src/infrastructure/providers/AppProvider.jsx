'use client';

import { RefineProvider } from './RefineProvider.jsx';
import ThemeProvider from './ThemeProvider.jsx';

export function AppProvider({ defaultMode, apiBaseUrl, resources, children }) {
    return (
        <ThemeProvider>
            <RefineProvider defaultMode={defaultMode} apiBaseUrl={apiBaseUrl} resources={resources}>
                {children}
            </RefineProvider>
        </ThemeProvider>
    );
}
