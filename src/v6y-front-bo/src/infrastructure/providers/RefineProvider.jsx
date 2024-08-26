'use client';

import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { SessionProvider, useSession } from 'next-auth/react';
import React from 'react';

import useNavigationAdapter from '../adapters/navigation/useNavigationAdapter.jsx';
import { ColorModeProvider } from './ColorModeProvider.jsx';
import { DataProvider } from './DataProvider.jsx';
import { RefineAuthProvider } from './RefineAuthProvider.jsx';
import { RefineDevtoolsProvider } from './RefineDevtoolsProvider.jsx';

const App = ({ resources, apiBaseUrl, defaultMode, children }) => {
    const { data, status } = useSession();
    const { pathname } = useNavigationAdapter();

    if (status === 'loading') {
        return <span>loading...</span>;
    }

    return (
        <RefineDevtoolsProvider>
            <ColorModeProvider defaultMode={defaultMode}>
                <Refine
                    routerProvider={routerProvider}
                    dataProvider={DataProvider(apiBaseUrl)}
                    notificationProvider={useNotificationProvider}
                    authProvider={RefineAuthProvider({ status, data, redirectionUrl: pathname })}
                    resources={resources}
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                    }}
                >
                    {children}
                </Refine>
            </ColorModeProvider>
        </RefineDevtoolsProvider>
    );
};

export const RefineProvider = (props) => {
    return (
        <SessionProvider>
            <App {...props} />
        </SessionProvider>
    );
};
