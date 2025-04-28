'use client';

import { useThemeConfigProvider, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';
import { buildDashboardMenuItems } from '../../../commons/config/VitalityCommonConfig';
import VitalityDashboardMenu from './VitalityDashboardMenu';

const VitalityDashboardView = () => {
    const { currentConfig } = useThemeConfigProvider();
    const { translate } = useTranslationProvider();

    return (
        <>
            <VitalitySearchBar
                placeholder={translate('vitality.dashboardPage.pageTitle')}
                helper={translate('vitality.searchPage.inputHelper')}
                label={translate('vitality.searchPage.inputLabel')}
            />
            <VitalityDashboardMenu options={buildDashboardMenuItems(currentConfig?.token)} />
        </>
    );
};

export default VitalityDashboardView;
