'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader';

const VitalityGeneralInformationView = dynamic(
    () => import('./infos/VitalityGeneralInformationView'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityAuditReportsView = dynamic(() => import('./audit-reports/VitalityAuditReportsView'), {
    loading: () => <VitalityLoader />,
});

const VitalityQualityIndicatorsView = dynamic(
    () => import('./quality-indicators/VitalityQualityIndicatorsView'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityDependenciesView = dynamic(() => import('./dependencies/VitalityDependenciesView'), {
    loading: () => <VitalityLoader />,
});

const VitalityEvolutionsView = dynamic(() => import('./evolutions/VitalityEvolutionsView'), {
    loading: () => <VitalityLoader />,
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
