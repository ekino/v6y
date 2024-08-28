'use client';

import { RefineProvider } from './RefineProvider.jsx';
import ThemeProvider from './ThemeProvider.jsx';

export function AppProvider({ defaultMode, resources, children }) {
    return (
        <ThemeProvider>
            <RefineProvider defaultMode={defaultMode} resources={resources}>
                {children}
            </RefineProvider>
        </ThemeProvider>
    );
}
