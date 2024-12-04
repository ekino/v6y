'use client';

import * as React from 'react';

import VitalityDynamicLoader from '../../../commons/components/VitalityDynamicLoader';

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
