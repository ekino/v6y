'use client';

import { VitalityDynamicLoader } from '@v6y/shared-ui';
import * as React from 'react';

const VitalityGeneralInformationView = VitalityDynamicLoader(
    () => import('./infos/VitalityGeneralInformationView'),
);

const VitalityAuditReportsView = VitalityDynamicLoader(
    () => import('./audit-reports/VitalityAuditReportsView'),
);

const VitalityQualityIndicatorsView = VitalityDynamicLoader(
    () => import('./quality-indicators/VitalityQualityIndicatorsView'),
);

const VitalityDependenciesView = VitalityDynamicLoader(
    () => import('./dependencies/VitalityDependenciesView'),
);

const VitalityEvolutionsView = VitalityDynamicLoader(
    () => import('./evolutions/VitalityEvolutionsView'),
);

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
