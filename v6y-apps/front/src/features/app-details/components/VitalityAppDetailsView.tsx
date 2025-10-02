'use client';

import { ApplicationType } from '@v6y/core-logic/src/types';
import {
  DynamicLoader,
  useNavigationAdapter,
} from '@v6y/ui-kit';
import { Button, ShuffleIcon, GlobeIcon, ReloadIcon, PlayIcon, Input } from '@v6y/ui-kit-front';
import * as React from 'react';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { exportAppDetailsDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
  buildClientQuery,
  useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import VitalitySummaryCard from '../components/summary-card/VitalitySummaryCard';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@v6y/ui-kit-front";

const VitalityGeneralInformationView = DynamicLoader(
  () => import('./infos/VitalityGeneralInformationView')
);

const VitalityAuditReportsView = DynamicLoader(
  () => import('./audit-reports/VitalityAuditReportsView')
);

const VitalityQualityIndicatorsView = DynamicLoader(
  () => import('./quality-indicators/VitalityQualityIndicatorsView')
);

const VitalityDependenciesView = DynamicLoader(
  () => import('./dependencies/VitalityDependenciesView')
);

const VitalityEvolutionsView = DynamicLoader(
  () => import('./evolutions/VitalityEvolutionsView')
);

const VitalityAppDetailsView = () => {
  const { getUrlParams } = useNavigationAdapter();
  const [_id] = getUrlParams(['_id']);
  const [activeTab, setActiveTab] = React.useState('overview');

  const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } =
    useClientQuery<{ getApplicationDetailsInfoByParams: ApplicationType }>({
      queryCacheKey: ['getApplicationDetailsInfoByParams', `${_id}`],
      queryBuilder: async () =>
        buildClientQuery({
          queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
          query: GetApplicationDetailsInfosByParams,
          variables: {
            _id: parseInt(_id as string, 10),
          },
        }),
    });

  const appInfos = appDetailsInfos?.getApplicationDetailsInfoByParams;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'security', label: 'Security' },
    { id: 'maintainability', label: 'Maintainability' },
    { id: 'devops', label: 'DevOps' },
  ];

  const onExportClicked = () => {
    if (appInfos) {
      exportAppDetailsDataToCSV(appInfos);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <VitalityGeneralInformationView appInfos={appInfos} />;
      case 'performance':
        return <VitalityAuditReportsView />;
      case 'accessibility':
        return <VitalityQualityIndicatorsView />;
      case 'security':
        return <VitalityDependenciesView />;
      case 'maintainability':
        return <VitalityEvolutionsView />;
      case 'devops':
        return <VitalityAuditReportsView />;
      default:
        return <VitalityGeneralInformationView appInfos={appInfos} />;
    }
  };

  if (isAppDetailsInfosLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gray-100 animate-pulse h-16 rounded-lg"></div>
        <div className="bg-gray-100 animate-pulse h-16 rounded-lg"></div>
        <div className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          {isAppDetailsInfosLoading ? (
            <div className="bg-gray-100 animate-pulse h-80 rounded-xl"></div>
          ) : (
            <VitalitySummaryCard appInfos={appInfos} />
          )}
        </div>

        <div className="col-span-9">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Select defaultValue="main">
                    <SelectTrigger className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">
                      <span className="flex items-center gap-2">
                        <ShuffleIcon /> main
                      </span>
                      </SelectItem>
                    </SelectContent>
                    </Select>
                  <Input type="date" className="w-fit" value="2025-01-01" />
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="p-2 h-9 w-9 border-gray-300 hover:bg-gray-50">
                    <ReloadIcon />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2 h-9 w-9 border-gray-300 hover:bg-gray-50">
                    <GlobeIcon />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2 h-9 w-9 border-gray-300 hover:bg-gray-50">
                    <PlayIcon />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-6">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>

                <Button
                  onClick={onExportClicked}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm"
                >
                  Export Reporting
                </Button>
              </div>
            </div>

            <div className="p-6">
              {isAppDetailsInfosLoading ? (
                <div className="bg-gray-100 animate-pulse h-96 rounded-lg"></div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalityAppDetailsView;
