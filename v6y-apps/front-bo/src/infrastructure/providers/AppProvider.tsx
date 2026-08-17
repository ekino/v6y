'use client';

import * as React from 'react';

import { AdminProvider } from '@v6y/ui-kit';

import VitalityPageLayout from '../../commons/components/layout/VitalityPageLayout';
import { VitalityRoutes } from '../../commons/config/VitalityNavigationConfig';
import { applyDetectedLocale } from '../translation/i18nHelper';
import { gqlAuthProvider, gqlDataProvider, gqlLiveProvider } from './GraphQLProvider';

type AppProviderProps = {
    children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
    // Apply the browser-detected locale after mount to avoid a hydration
    // mismatch (server renders the fallback 'en', client its cached locale).
    React.useEffect(() => {
        applyDetectedLocale();
    }, []);

    return (
        <AdminProvider
            dataProvider={gqlDataProvider}
            liveProvider={gqlLiveProvider}
            authProvider={gqlAuthProvider}
            resources={VitalityRoutes}
        >
            <VitalityPageLayout>{children}</VitalityPageLayout>
        </AdminProvider>
    );
};

export default AppProvider;
