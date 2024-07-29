'use client';

import React from 'react';

import VitalityPageLayout from '../../commons/components/VitalityPageLayout.jsx';
import VitalitySearchBar from '../../commons/components/VitalitySearchBar.jsx';
import VitalityDashboardMenu from './VitalityDashboardMenu.jsx';
import CommonsDico from '../../commons/dico/CommonsDico.js';
import VitalityConfig from '../../commons/config/VitalityConfig.js';

const { VITALITY_DASHBOARD_DATASOURCE } = VitalityConfig;

const VitalityDashboardView = () => {
    const onSearchChanged = (value) => {
        console.log(value);
    };

    return (
        <VitalityPageLayout pageTitle={CommonsDico.VITALITY_DASHBOARD_PAGE_TITLE}>
            <VitalitySearchBar
                placeholder={CommonsDico.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                helper={CommonsDico.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                onSearchChanged={onSearchChanged}
            />
            <VitalityDashboardMenu options={VITALITY_DASHBOARD_DATASOURCE} />
        </VitalityPageLayout>
    );
};

export default VitalityDashboardView;
