'use client';

import * as React from 'react';
import VitalityDynamicLoader from '../../../commons/components/VitalityDynamicLoader';

const VitalityGeneralInformationView = VitalityDynamicLoader('VitalityGeneralInformationView')

const VitalityAuditReportsView = VitalityDynamicLoader('VitalityAuditReportsView')

const VitalityQualityIndicatorsView = VitalityDynamicLoader('VitalityQualityIndicatorsView')

const VitalityDependenciesView = VitalityDynamicLoader('VitalityDependenciesView')

const VitalityEvolutionsView = VitalityDynamicLoader('VitalityEvolutionsView')

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
