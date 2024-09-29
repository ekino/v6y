'use client';

import { DevtoolsPanel, DevtoolsProvider as DevtoolsProviderBase } from '@refinedev/devtools';
import * as React from 'react';
import { ReactNode } from 'react';

export const RefineDevtoolsProvider = ({ children }: { children: ReactNode }) => {
    return (
        <DevtoolsProviderBase>
            {children}
            <DevtoolsPanel />
        </DevtoolsProviderBase>
    );
};
