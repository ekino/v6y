'use client';

import * as React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';
import { VITALITY_DASHBOARD_DATASOURCE } from '../../../commons/config/VitalityCommonConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import VitalityDashboardMenu from './VitalityDashboardMenu';

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
