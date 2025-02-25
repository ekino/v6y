'use client';

import { useTheme } from '@v6y/shared-ui';
import * as React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';
import { buildDashboardMenuItems } from '../../../commons/config/VitalityCommonConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import VitalityDashboardMenu from './VitalityDashboardMenu';

const VitalityDashboardView = () => {
    const { themeToken } = useTheme();

    return (
        <>
            <VitalitySearchBar
                placeholder={VitalityTerms.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                helper={VitalityTerms.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                label={VitalityTerms.VITALITY_SEARCHBAR_INPUT_LABEL}
            />
            <VitalityDashboardMenu options={buildDashboardMenuItems(themeToken)} />
        </>
    );
};

export default VitalityDashboardView;
