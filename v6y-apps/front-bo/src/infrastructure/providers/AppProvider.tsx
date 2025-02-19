'use client';

import { ThemeProvider } from '@v6y/shared-ui';
import * as React from 'react';

import { AppProviderProps } from '../types/AppProviderProps';
import { RefineProvider } from './RefineProvider';

export function AppProvider({ defaultMode, resources, children }: AppProviderProps) {
    return (
        <ThemeProvider enableConfig={false}>
            <RefineProvider defaultMode={defaultMode} resources={resources}>
                {children}
            </RefineProvider>
        </ThemeProvider>
    );
}
