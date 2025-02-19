'use client';

import { useNotificationProvider } from '@refinedev/antd';
import { RefineThemes } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { ColorModeProvider, useTranslationProvider } from '@v6y/shared-ui';
import { TFunction } from 'i18next';
import * as React from 'react';

import '../translation/i18nHelper';
import { AppProviderProps } from '../types/AppProviderProps';
import { gqlAuthProvider, gqlLiveProvider } from './GraphQLProvider';
import { RefineDevtoolsProvider } from './RefineDevtoolsProvider';

export const RefineProvider = ({ resources, defaultMode, children }: AppProviderProps) => {
    const { translateHelper, i18n } = useTranslationProvider();

    const i18nProvider = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        translate: (key: string, params: TFunction) => translateHelper(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <RefineDevtoolsProvider>
            <ColorModeProvider defaultThemeMode={defaultMode} defaultTheme={RefineThemes}>
                <Refine
                    routerProvider={routerProvider}
                    liveProvider={gqlLiveProvider}
                    authProvider={gqlAuthProvider}
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
            </ColorModeProvider>
        </RefineDevtoolsProvider>
    );
};
