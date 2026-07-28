'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { AdminProvider } from '@v6y/ui-kit';

import VitalityPageLayout from '../../commons/components/layout/VitalityPageLayout';
import { VitalityRoutes } from '../../commons/config/VitalityNavigationConfig';
import { applyDetectedLocale } from '../translation/i18nHelper';
import { gqlAuthProvider, gqlDataProvider, gqlLiveProvider } from './GraphQLProvider';

type AppProviderProps = {
    children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
    // Switch to the user's real cached locale only after the initial,
    // hydration-safe render (see i18nHelper.ts for why the app boots with
    // the SSR fallback locale).
    useEffect(() => {
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
