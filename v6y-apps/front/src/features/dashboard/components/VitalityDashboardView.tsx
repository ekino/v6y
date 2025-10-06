"use client";

import React from 'react';
import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';
import { buildDashboardMenuItems } from '../../../commons/config/VitalityCommonConfig';
import VitalityDashboardMenu from './VitalityDashboardMenu';
import { useTranslationProvider } from '@v6y/ui-kit';

const VitalityDashboardView = () => {
  const items = buildDashboardMenuItems({});
  const { translate } = useTranslationProvider();

  return (
    <div>
      <VitalitySearchBar
        placeholder={translate('vitality.searchPage.inputPlaceholder')}
        helper={translate('vitality.searchPage.inputHelper')}
        label={translate('vitality.searchPage.inputLabel')}
      />
      <VitalityDashboardMenu options={items} />
    </div>
  );
};

export default VitalityDashboardView;
