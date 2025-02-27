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
import * as React from 'react';

import { ThemeModes, ThemeProvider, ThemeTypes } from '../../theme';
import { useTranslationProvider } from '../../translation/useTranslationProvider';
import { AdminDevtoolsProvider } from './AdminDevtoolsProvider';

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

    const i18nProvider = {
        translate,
        changeLocale,
        getLocale,
    };

    return (
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
    );
};

export default AdminProvider;
