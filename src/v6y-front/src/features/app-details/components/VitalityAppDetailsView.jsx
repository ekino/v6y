'use client';

import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';

const VitalityGeneralInformationView = dynamic(
    () => import('./infos/VitalityGeneralInformationView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityAuditReportsView = dynamic(
    () => import('./audit-reports/VitalityAuditReportsView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityQualityIndicatorsView = dynamic(
    () => import('./quality-indicators/VitalityQualityIndicatorsView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityDependenciesView = dynamic(
    () => import('./dependencies/VitalityDependenciesView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityEvolutionsView = dynamic(() => import('./evolutions/VitalityEvolutionsView.jsx'), {
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
