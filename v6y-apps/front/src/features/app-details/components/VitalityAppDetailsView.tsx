'use client';

import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Button, GlobeIcon, Input, PlayIcon, ReloadIcon, ShuffleIcon } from '@v6y/ui-kit-front';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@v6y/ui-kit-front';

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

const VitalitySecuritySection = DynamicLoader(
    () => import('./audit-reports/VitalitySecuritySection'),
);

const VitalityAppDetailsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedBranch, setSelectedBranch] = React.useState('main');
    const [selectedDate, setSelectedDate] = React.useState('2025-01-01');
    const [isRunningAudit, setIsRunningAudit] = React.useState(false);
    const [auditTrigger, setAuditTrigger] = React.useState(0);

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
        { id: 'devops', label: translate('vitality.appDetailsPage.tabs.devops') },
    ];

    const onExportClicked = () => {
        if (appInfos) {
            exportAppDetailsDataToCSV(appInfos);
        }
    };

    const onRunAuditClicked = async () => {
        setIsRunningAudit(true);
        try {
            setAuditTrigger((prev) => prev + 1);
        } catch (error) {
            console.error('Error running audit:', error);
        } finally {
            setTimeout(() => {
                setIsRunningAudit(false);
            }, 2000);
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
                    <VitalityAuditReportsView auditTrigger={auditTrigger} category="performance" />
                );
            case 'accessibility':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="accessibility"
                    />
                );
            case 'security':
                return <VitalitySecuritySection auditTrigger={auditTrigger} />;
            case 'maintainability':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="maintainability"
                    />
                );
            case 'devops':
                return <VitalityAuditReportsView auditTrigger={auditTrigger} category="dora" />;
            default:
                return (
                    <VitalityGeneralInformationView
                        appInfos={appInfos}
                        branch={selectedBranch}
                        date={selectedDate}
                        auditTrigger={auditTrigger}
                    />
                );
        }
    };

    if (isAppDetailsInfosLoading) {
        return (
            <div className="max-w-7xl mx-auto md:p-6 space-y-6">
                <div className="bg-gray-100 animate-pulse h-16 rounded-lg"></div>
                <div className="bg-gray-100 animate-pulse h-16 rounded-lg"></div>
                <div className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-4 md:px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <div className="lg:col-span-3 w-full">
                    {isAppDetailsInfosLoading ? (
                        <div className="bg-gray-100 animate-pulse h-80 rounded-xl"></div>
                    ) : appInfos ? (
                        <VitalitySummaryCard appInfos={appInfos} />
                    ) : null}
                </div>

                <div className="lg:col-span-9 w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-2 mb-4 md:mb-2.5">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Select
                                value={selectedBranch}
                                onValueChange={(v) => setSelectedBranch(v)}
                            >
                                <SelectTrigger className="h-10 sm:h-8 border-slate-300 rounded-md px-3 sm:px-4 py-2 text-sm bg-white">
                                    <span className="flex items-center gap-1">
                                        <ShuffleIcon className="w-4 h-4 flex-shrink-0" />
                                        <SelectValue className="truncate" />
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
                                className="h-10 sm:h-8 border-slate-300 rounded-md text-sm"
                                value={selectedDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSelectedDate(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 sm:h-8 w-10 sm:w-9 p-2 border-slate-300 rounded-md flex-shrink-0"
                                title="Reload"
                            >
                                <ReloadIcon className="w-4 h-4 flex-shrink-0" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 sm:h-8 w-10 sm:w-9 p-2 border-slate-300 rounded-md flex-shrink-0"
                                title="Globe"
                            >
                                <GlobeIcon className="w-4 h-4 flex-shrink-0" />
                            </Button>
                            <Button
                                onClick={onRunAuditClicked}
                                disabled={isRunningAudit}
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 border-slate-300 rounded-md flex items-center gap-1.5"
                            >
                                {isRunningAudit ? (
                                    <>
                                        <ReloadIcon className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">
                                            {translate(
                                                'vitality.appDetailsPage.runAuditButtonLoading',
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <PlayIcon className="w-4 h-4" />
                                        <span className="text-sm">
                                            {translate('vitality.appDetailsPage.runAuditButton')}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-2 mb-4 md:mb-2">
                        <div
                            className="bg-slate-100 p-1.5 rounded-md inline-flex overflow-x-auto"
                            role="tablist"
                            aria-label="Details tabs"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={`px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
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
                            className="w-full sm:w-auto h-10 sm:h-8 bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium flex-shrink-0"
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
