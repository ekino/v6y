'use client';

import { useNotificationProvider } from '@refinedev/antd';
import {
    AuthProvider,
    DataProvider,
    DataProviders,
    LiveProvider,
    Refine,
    ResourceProps,
} from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { ThemeModes, ThemeProvider, ThemeTypes } from '../../theme';
import { useTranslationProvider } from '../../translation/useTranslationProvider';
import { AdminDevtoolsProvider } from './AdminDevtoolsProvider';

// Extend QueryClient prototype for Refine compatibility
declare module '@tanstack/react-query' {
    interface QueryClient {
        defaultMutationOptions(): unknown;
    }
}

type AdminProviderProps = {
    dataProvider?: DataProvider | DataProviders;
    liveProvider?: unknown;
    authProvider?: AuthProvider;
    resources?: ResourceProps[];
    children: React.ReactNode;
};

const AdminProvider = ({
    dataProvider,
    liveProvider,
    authProvider,
    resources,
    children,
}: AdminProviderProps) => {
    const { translate, changeLocale, getLocale } = useTranslationProvider();

    const [queryClient] = React.useState(() => {
        // Monkey-patch QueryClient prototype to add missing method for Refine compatibility
        // This must happen before any QueryClient instances are created
        if (!QueryClient.prototype.defaultMutationOptions) {
            QueryClient.prototype.defaultMutationOptions = function () {
                return this.getDefaultOptions().mutations || {};
            };
        }

        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    retry: false,
                },
                mutations: {
                    retry: false,
                },
            },
        });

        return client;
    });

    const i18nProvider = {
        translate,
        changeLocale,
        getLocale,
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AdminDevtoolsProvider>
                <ThemeProvider
                    theme={ThemeTypes.ADMIN_DEFAULT}
                    themeMode={ThemeModes.LIGHT}
                    config={{ useSSRProvider: true, useConfigProvider: true }}
                >
                    <Refine
                        routerProvider={routerProvider}
                        dataProvider={dataProvider}
                        liveProvider={liveProvider as LiveProvider}
                        authProvider={authProvider}
                        notificationProvider={useNotificationProvider}
                        i18nProvider={i18nProvider}
                        resources={resources}
                        options={{
                            liveMode: 'auto',
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            useNewQueryKeys: true,
                            projectId: '15myAK-vcBUHf-ebxe3F',
                        }}
                    >
                        {children}
                    </Refine>
                </ThemeProvider>
            </AdminDevtoolsProvider>
        </QueryClientProvider>
    );
};

export default AdminProvider;
