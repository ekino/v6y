'use client';

import { useTranslationProvider } from '@v6y/ui-kit-front';
import * as React from 'react';

import VitalitySearchBar from '../../../commons/components/VitalitySearchBar';
import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityDashboardFilters from './VitalityDashboardFilters';
import VitalityDashboardMenu from './VitalityDashboardMenu';

const VitalityDashboardView = () => {
  const { translate } = useTranslationProvider();

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-1 flex flex-col gap-y-8">
        {/* Dashboard menu (mocked in tests) */}
        <VitalityDashboardMenu
          options={[
            { title: 'React', url: '#' },
            { title: 'Angular', url: '#' },
            { title: 'React Legacy', url: '#' },
            { title: 'Angular Legacy', url: '#' },
            { title: 'Health statistics', url: '#' },
          ]}
        />

        <VitalitySearchBar
          placeholder="ex: Vitality"
          helper={translate('vitality.searchPage.inputHelper')}
          label={translate('vitality.searchPage.inputLabel')}
        />
        <VitalityDashboardFilters />
      </div>
      <div className="col-span-2">
        <VitalityAppList source="search" />
      </div>
    </div>
  );
};

export default VitalityDashboardView;
