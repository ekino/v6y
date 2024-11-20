'use client';

import * as React from 'react';
import VitalityDynamicLoader from '../../../commons/components/VitalityDynamicLoader';

const VitalityGeneralInformationView = VitalityDynamicLoader('./infos/VitalityGeneralInformationView')

const VitalityAuditReportsView = VitalityDynamicLoader('./audit-reports/VitalityAuditReportsView')

const VitalityQualityIndicatorsView = VitalityDynamicLoader('./quality-indicators/VitalityQualityIndicatorsView')

const VitalityDependenciesView = VitalityDynamicLoader('./dependencies/VitalityDependenciesView')

const VitalityEvolutionsView = VitalityDynamicLoader('./evolutions/VitalityEvolutionsView')

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
