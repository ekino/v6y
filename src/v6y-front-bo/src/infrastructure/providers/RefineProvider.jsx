'use client';

import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import React from 'react';

import { useNextTranslation } from '../adapters/translation/TranslationAdapter.js';
// initialize i18n
import '../adapters/translation/i18n.js';
import { ColorModeProvider } from './ColorModeProvider.jsx';
import { gqlAuthProvider, gqlDataProvider, gqlLiveProvider } from './GraphQLProvider.js';
import { RefineDevtoolsProvider } from './RefineDevtoolsProvider.jsx';

export const RefineProvider = ({ resources, defaultMode, children }) => {
    const { translateHelper, i18nHelper } = useNextTranslation();
    const i18nProvider = {
        translate: (key, params) => translateHelper(key, params),
        changeLocale: (lang) => i18nHelper.changeLanguage(lang),
        getLocale: () => i18nHelper.language,
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
