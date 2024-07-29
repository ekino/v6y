'use client';

import React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar.jsx';
import VitalityDashboardMenu from './VitalityDashboardMenu.jsx';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import VitalityCommonConfig from '../../../commons/config/VitalityCommonConfig.js';

const VitalityDashboardView = () => {
    const onSearchChanged = (value) => {
        console.log(value);
    };

    return (
        <>
            <VitalitySearchBar
                placeholder={VitalityTerms.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                helper={VitalityTerms.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                onSearchChanged={onSearchChanged}
            />
            <VitalityDashboardMenu options={VitalityCommonConfig.VITALITY_DASHBOARD_DATASOURCE} />
        </>
    );
};

export default VitalityDashboardView;
