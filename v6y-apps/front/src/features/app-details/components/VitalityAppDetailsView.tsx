'use client';

import { DynamicLoader } from '@v6y/shared-ui';
import * as React from 'react';

const VitalityGeneralInformationView = DynamicLoader(
    () => import('./infos/VitalityGeneralInformationView'),
);

const VitalityAuditReportsView = DynamicLoader(
    () => import('./audit-reports/VitalityAuditReportsView'),
);

const VitalityQualityIndicatorsView = DynamicLoader(
    () => import('./quality-indicators/VitalityQualityIndicatorsView'),
);

const VitalityDependenciesView = DynamicLoader(
    () => import('./dependencies/VitalityDependenciesView'),
);

const VitalityEvolutionsView = DynamicLoader(() => import('./evolutions/VitalityEvolutionsView'));

const VitalityAppDetailsView = () => {
    return (
        <>
            <VitalityGeneralInformationView />
            <VitalityQualityIndicatorsView />
            <VitalityAuditReportsView />
            <VitalityEvolutionsView />
            <VitalityDependenciesView />
        </>
    );
};

export default VitalityAppDetailsView;
