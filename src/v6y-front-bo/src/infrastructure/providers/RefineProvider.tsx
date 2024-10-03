'use client';

import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { TFunction } from 'i18next';
import * as React from 'react';

import { useNextTranslation } from '../adapters/translation/TranslationAdapter';
import '../adapters/translation/i18nHelper';
import { AppProviderProps } from '../types/AppProviderProps';
import { ColorModeProvider } from './ColorModeProvider';
import { gqlAuthProvider, gqlDataProvider, gqlLiveProvider } from './GraphQLProvider';
import { RefineDevtoolsProvider } from './RefineDevtoolsProvider';

export const RefineProvider = ({ resources, defaultMode, children }: AppProviderProps) => {
    const { translateHelper, i18n } = useNextTranslation();

    const i18nProvider = {
        translate: (key: string, params: TFunction) => translateHelper(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <RefineDevtoolsProvider>
            <ColorModeProvider defaultMode={defaultMode}>
                <Refine
                    routerProvider={routerProvider}
                    dataProvider={gqlDataProvider}
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
