'use client';

import * as React from 'react';

import { AppProviderProps } from '../types/AppProviderProps';
import { RefineProvider } from './RefineProvider';
import ThemeProvider from './ThemeProvider';

export function AppProvider({ defaultMode, resources, children }: AppProviderProps) {
    return (
        <ThemeProvider>
            <RefineProvider defaultMode={defaultMode} resources={resources}>
                {children}
            </RefineProvider>
        </ThemeProvider>
    );
}
