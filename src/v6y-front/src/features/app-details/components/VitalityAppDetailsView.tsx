'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader';

const VitalityLoading = () => <VitalityLoader />;

const VitalityGeneralInformationView = dynamic(
    () => import('./infos/VitalityGeneralInformationView'),
    {
        loading: VitalityLoading,
    },
);

const VitalityAuditReportsView = dynamic(() => import('./audit-reports/VitalityAuditReportsView'), {
    loading: VitalityLoading,
});

const VitalityQualityIndicatorsView = dynamic(
    () => import('./quality-indicators/VitalityQualityIndicatorsView'),
    {
        loading: VitalityLoading,
    },
);

const VitalityDependenciesView = dynamic(() => import('./dependencies/VitalityDependenciesView'), {
    loading: VitalityLoading,
});

const VitalityEvolutionsView = dynamic(() => import('./evolutions/VitalityEvolutionsView'), {
    loading: VitalityLoading,
});

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
