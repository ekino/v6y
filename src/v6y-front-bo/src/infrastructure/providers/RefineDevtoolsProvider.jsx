'use client';

import { DevtoolsPanel, DevtoolsProvider as DevtoolsProviderBase } from '@refinedev/devtools';
import React from 'react';

export const RefineDevtoolsProvider = (props) => {
    return (
        <DevtoolsProviderBase>
            {props.children}
            <DevtoolsPanel />
        </DevtoolsProviderBase>
    );
};
