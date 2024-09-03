'use client';

import React, { Suspense } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityAppDetailsEvolutionsView from './VitalityAppDetailsEvolutionsView.jsx';
import VitalityAppDetailsInfosView from './VitalityAppDetailsInfosView.jsx';
import VitalityAppDetailsAuditReportsView from './audit-reports/VitalityAppDetailsAuditReportsView.jsx';
import VitalityAppDetailsDependenciesView from './dependencies/VitalityAppDetailsDependenciesView.jsx';

const VitalityAppDetailsView = () => {
    return (
        <>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityAppDetailsInfosView />
            </Suspense>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityAppDetailsAuditReportsView />
            </Suspense>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityAppDetailsEvolutionsView />
            </Suspense>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityAppDetailsDependenciesView />
            </Suspense>
        </>
    );
};

export default VitalityAppDetailsView;
