'use client';

import React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar.jsx';
import { VITALITY_DASHBOARD_DATASOURCE } from '../../../commons/config/VitalityCommonConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import VitalityDashboardMenu from './VitalityDashboardMenu.jsx';


const VitalityDashboardView = () => (
    <>
        <VitalitySearchBar
            placeholder={VitalityTerms.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
            helper={VitalityTerms.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
            label={VitalityTerms.VITALITY_SEARCHBAR_INPUT_LABEL}
        />
        <VitalityDashboardMenu options={VITALITY_DASHBOARD_DATASOURCE} />
    </>
);

export default VitalityDashboardView;
