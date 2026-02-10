'use client';

import { GlobeIcon, PlayIcon, ReloadIcon, ShuffleIcon } from 'lucide-react';
import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Button } from '@v6y/ui-kit-front/components/atoms/button';
import { Input } from '@v6y/ui-kit-front/components/atoms/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@v6y/ui-kit-front/components/molecules/Select';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { exportAppDetailsDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import VitalitySummaryCard from '../components/summary-card/VitalitySummaryCard';

const VitalityGeneralInformationView = DynamicLoader(
    () => import('./infos/VitalityGeneralInformationView'),
);

const VitalityAuditReportsView = DynamicLoader(
    () => import('./audit-reports/VitalityAuditReportsView'),
);

const VitalityQualityIndicatorsView = DynamicLoader(
    () => import('./quality-indicators/VitalityQualityIndicatorsView'),
);

const VitalityDependenciesView = DynamicLoader(
    () => import('./dependencies/VitalityDependenciesView'),
);

const VitalityEvolutionsView = DynamicLoader(() => import('./evolutions/VitalityEvolutionsView'));

const VitalityAppDetailsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedBranch, setSelectedBranch] = React.useState('main');
    const [selectedDate, setSelectedDate] = React.useState('2025-01-01');

    const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } = useClientQuery<{
        getApplicationDetailsInfoByParams: ApplicationType;
    }>({
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
        { id: 'overview', label: translate('vitality.appDetailsPage.tabs.overview') },
        { id: 'performance', label: translate('vitality.appDetailsPage.tabs.performance') },
        { id: 'accessibility', label: translate('vitality.appDetailsPage.tabs.accessibility') },
        { id: 'security', label: translate('vitality.appDetailsPage.tabs.security') },
        { id: 'maintainability', label: translate('vitality.appDetailsPage.tabs.maintainability') },
    ];

    const onExportClicked = () => {
        if (appInfos) {
            exportAppDetailsDataToCSV(appInfos);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <VitalityGeneralInformationView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                    />
                );
            case 'performance':
                return (
                    <VitalityAuditReportsView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                    />
                );
            case 'accessibility':
                return (
                    <VitalityQualityIndicatorsView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                    />
                );
            case 'security':
                return (
                    <VitalityDependenciesView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                    />
                );
            case 'maintainability':
                return (
                    <VitalityEvolutionsView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                    />
                );
            default:
                return (
                    <VitalityGeneralInformationView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                    />
                );
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
                    ) : appInfos ? (
                        <VitalitySummaryCard appInfos={appInfos} />
                    ) : null}
                </div>

                <div className="col-span-9">
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                            <Select
                                value={selectedBranch}
                                onValueChange={(v) => setSelectedBranch(v)}
                            >
                                <SelectTrigger className="h-8 border-slate-300 rounded-md px-4 py-2 text-sm bg-white">
                                    <span className="flex items-center gap-1">
                                        <ShuffleIcon className="w-4 h-4" />
                                        <SelectValue />
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {appInfos?.repo?.allBranches?.map((branch) => (
                                        <SelectItem key={branch} value={branch} className="text-sm">
                                            {branch}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                type="date"
                                className="h-9 border-slate-300 rounded-md text-sm"
                                value={selectedDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSelectedDate(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-9 p-2 border-slate-300 rounded-md"
                            >
                                <ReloadIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-9 p-2 border-slate-300 rounded-md"
                            >
                                <GlobeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-9 p-2 border-slate-300 rounded-md"
                            >
                                <PlayIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <div
                            className="bg-slate-100 p-1.5 rounded-md inline-flex"
                            role="tablist"
                            aria-label="Details tabs"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-700 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <Button
                            onClick={onExportClicked}
                            className="h-8 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            {translate('vitality.appDetailsPage.exportButton')}
                        </Button>
                    </div>

                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default VitalityAppDetailsView;
