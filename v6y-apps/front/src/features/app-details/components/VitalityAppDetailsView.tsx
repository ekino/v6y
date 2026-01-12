'use client';

import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { toast } from 'sonner';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Button, GlobeIcon, Input, PlayIcon, ReloadIcon, ShuffleIcon } from '@v6y/ui-kit-front';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { exportAppDetailsDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientMutation,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import TriggerApplicationAuditMutation from '../api/triggerApplicationAudit';
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
    const queryClient = useQueryClient();
    const [_id] = getUrlParams(['_id']);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedBranch, setSelectedBranch] = React.useState('main');
    const [selectedDate, setSelectedDate] = React.useState('2025-01-01');
    const [lastAuditTime, setLastAuditTime] = React.useState<number | null>(null);
    const [cooldownRemaining, setCooldownRemaining] = React.useState(0);

    // Cooldown period: 30 seconds
    const AUDIT_COOLDOWN = 30000;

    React.useEffect(() => {
        if (lastAuditTime) {
            const interval = setInterval(() => {
                const elapsed = Date.now() - lastAuditTime;
                const remaining = Math.max(0, Math.ceil((AUDIT_COOLDOWN - elapsed) / 1000));
                setCooldownRemaining(remaining);

                if (remaining === 0) {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [lastAuditTime]);

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

    const { mutate: triggerAudit, isLoading: isTriggeringAudit } = useClientMutation<{
        triggerApplicationAudit: { success: boolean; message: string; data: unknown };
    }>({
        mutationKey: ['triggerApplicationAudit'],
        mutationBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: TriggerApplicationAuditMutation,
                variables: {
                    applicationId: parseInt(_id as string, 10),
                    branch: selectedBranch,
                },
            }),
        onSuccess: (data) => {
            console.log('[Audit Trigger] Success response:', data);
            if (data?.triggerApplicationAudit?.success) {
                setLastAuditTime(Date.now());

                toast.success(
                    data.triggerApplicationAudit.message || 'Audit started successfully!',
                    {
                        description:
                            'Processing may take 30-60 seconds. Results will appear in the Performance tab.',
                        duration: 5000,
                    },
                );

                // Switch to performance tab to show where results will appear
                setActiveTab('performance');

                // Invalidate and refetch audit results after a delay to allow auditors to process
                setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ['getApplicationDetailsAuditReportsByParams'],
                    });
                }, 5000);

                // Set up polling to refresh results periodically
                const pollInterval = setInterval(() => {
                    queryClient.invalidateQueries({
                        queryKey: ['getApplicationDetailsAuditReportsByParams'],
                    });
                }, 15000); // Poll every 15 seconds

                // Stop polling after 3 minutes
                setTimeout(() => {
                    clearInterval(pollInterval);
                }, 180000);
            } else {
                console.error('[Audit Trigger] Failed:', data?.triggerApplicationAudit?.message);
                toast.error(data?.triggerApplicationAudit?.message || 'Failed to trigger audit');
            }
        },
        onError: (error) => {
            console.error('[Audit Trigger] Error:', error);
            toast.error(`Failed to trigger audit: ${error.message || 'Please try again.'}`);
        },
    });

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
                                onClick={() => window.location.reload()}
                                title="Refresh page"
                            >
                                <ReloadIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-9 p-2 border-slate-300 rounded-md"
                                onClick={() =>
                                    appInfos?.repo?.url && window.open(appInfos.repo.url, '_blank')
                                }
                                title="View repository"
                                disabled={!appInfos?.repo?.url}
                            >
                                <GlobeIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`h-8 px-3 border-slate-300 rounded-md flex items-center gap-2 transition-all ${
                                    isTriggeringAudit || cooldownRemaining > 0
                                        ? 'opacity-70 cursor-wait'
                                        : ''
                                }`}
                                onClick={() => triggerAudit()}
                                disabled={isTriggeringAudit || !appInfos || cooldownRemaining > 0}
                                title={
                                    cooldownRemaining > 0
                                        ? `Please wait ${cooldownRemaining}s before running another audit`
                                        : isTriggeringAudit
                                          ? 'Audit in progress...'
                                          : 'Run audit analysis'
                                }
                            >
                                {isTriggeringAudit ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Running...</span>
                                    </>
                                ) : cooldownRemaining > 0 ? (
                                    <>
                                        <PlayIcon className="w-4 h-4" />
                                        <span>Wait {cooldownRemaining}s</span>
                                    </>
                                ) : (
                                    <>
                                        <PlayIcon className="w-4 h-4" />
                                        <span>Run Audit</span>
                                    </>
                                )}
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
