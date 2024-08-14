'use client';

import React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar.jsx';
import VitalityCommonConfig from '../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import VitalityDashboardMenu from './VitalityDashboardMenu.jsx';

const VitalityDashboardView = () => {
    const onSearchChanged = (value) => {
        console.log(value);
    };

    return (
        <>
            <VitalitySearchBar
                placeholder={VitalityTerms.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                helper={VitalityTerms.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                label={VitalityTerms.VITALITY_SEARCHBAR_INPUT_LABEL}
                onSearchChanged={onSearchChanged}
            />
            <VitalityDashboardMenu options={VitalityCommonConfig.VITALITY_DASHBOARD_DATASOURCE} />
        </>
    );
};

export default VitalityDashboardView;
