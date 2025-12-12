'use client';

import * as React from 'react';

import { AdminProvider } from '@v6y/ui-kit';

import VitalityPageLayout from '../../commons/components/layout/VitalityPageLayout';
import { VitalityRoutes } from '../../commons/config/VitalityNavigationConfig';
import { gqlAuthProvider, gqlDataProvider, gqlLiveProvider } from './GraphQLProvider';

type AppProviderProps = {
    children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => (
    <AdminProvider
        dataProvider={gqlDataProvider}
        liveProvider={gqlLiveProvider}
        authProvider={gqlAuthProvider}
        resources={VitalityRoutes}
    >
        <VitalityPageLayout>{children}</VitalityPageLayout>
    </AdminProvider>
);

export default AppProvider;
