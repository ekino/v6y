'use client';

import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Button, GlobeIcon, Input, PlayIcon, ReloadIcon } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { exportAppDetailsDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import VitalitySummaryCard from '../components/summary-card/VitalitySummaryCard';
import BranchSelector from './BranchSelector';

const VitalityGeneralInformationView = DynamicLoader(
    () => import('./infos/VitalityGeneralInformationView'),
);

const VitalityAuditReportsView = DynamicLoader(
    () => import('./audit-reports/VitalityAuditReportsView'),
);

const VitalitySecuritySection = DynamicLoader(
    () => import('./audit-reports/VitalitySecuritySection'),
);

const VitalitySonarQubeView = DynamicLoader(() => import('./sonarqube/VitalitySonarQubeView'));

const VitalityAuditRunHistoryView = DynamicLoader(
    () => import('./audit-runs/VitalityAuditRunHistoryView'),
);

const extractProjectKeyFromSonarUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        return (
            urlObj.searchParams.get('id') ||
            urlObj.searchParams.get('project') ||
            urlObj.searchParams.get('projectKey') ||
            null
        );
    } catch {
        return null;
    }
};

const getSonarQubeLink = (appInfos?: ApplicationType) => {
    const strictSonarLink = appInfos?.links?.find(
        (link) => link?.label === 'Application SonarQube url',
    )?.value;
    if (strictSonarLink && extractProjectKeyFromSonarUrl(strictSonarLink)) {
        return strictSonarLink;
    }

    const legacyCodeQualityLink = appInfos?.links?.find(
        (link) => link?.label === 'Application code quality platform url',
    )?.value;
    if (legacyCodeQualityLink && extractProjectKeyFromSonarUrl(legacyCodeQualityLink)) {
        return legacyCodeQualityLink;
    }

    const sonarLink = appInfos?.links?.find((link) =>
        link?.value?.toLowerCase?.().includes('sonar'),
    )?.value;
    if (sonarLink && extractProjectKeyFromSonarUrl(sonarLink)) {
        return sonarLink;
    }

    return undefined;
};

const VitalityAppDetailsView = () => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedBranch, setSelectedBranch] = React.useState('');
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
    const auditReportBranches = (appInfos?.repo?.allBranches || []) as string[];

    React.useEffect(() => {
        if (!auditReportBranches.length) {
            return;
        }

        if (!auditReportBranches.includes(selectedBranch)) {
            setSelectedBranch(auditReportBranches[0]);
        }
    }, [auditReportBranches, selectedBranch]);
    const sonarqubeLink = getSonarQubeLink(appInfos);

    const tabs = [
        { id: 'overview', label: translate('vitality.appDetailsPage.tabs.overview') },
        { id: 'performance', label: translate('vitality.appDetailsPage.tabs.performance') },
        { id: 'accessibility', label: translate('vitality.appDetailsPage.tabs.accessibility') },
        { id: 'security', label: translate('vitality.appDetailsPage.tabs.security') },
        { id: 'maintainability', label: translate('vitality.appDetailsPage.tabs.maintainability') },
        { id: 'greenIndex', label: translate('vitality.appDetailsPage.tabs.greenIndex') },
        { id: 'devops', label: translate('vitality.appDetailsPage.tabs.devops') },
        ...(sonarqubeLink
            ? [{ id: 'sonarqube', label: translate('vitality.appDetailsPage.tabs.sonarqube') }]
            : []),
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
                    <div className="space-y-8">
                        <VitalityGeneralInformationView
                            appInfos={appInfos}
                            branch={selectedBranch}
                            date={selectedDate}
                        />
                        <div className="pt-8 border-t border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">
                                {translate('vitality.appDetailsPage.auditHistory.title')}
                            </h2>
                            <VitalityAuditRunHistoryView
                                applicationId={parseInt(_id as string, 10)}
                            />
                        </div>
                    </div>
                );
            case 'performance':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="performance"
                        branch={selectedBranch}
                    />
                );
            case 'accessibility':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="accessibility"
                        branch={selectedBranch}
                    />
                );
            case 'security':
                return (
                    <VitalitySecuritySection auditTrigger={auditTrigger} branch={selectedBranch} />
                );
            case 'maintainability':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="maintainability"
                        branch={selectedBranch}
                    />
                );
            case 'greenIndex':
                return (
                    <VitalityAuditReportsView auditTrigger={auditTrigger} category="greenIndex" />
                );
            case 'devops':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="dora"
                        branch={selectedBranch}
                    />
                );
            case 'sonarqube':
                return sonarqubeLink ? (
                    <VitalitySonarQubeView
                        applicationId={parseInt(_id as string, 10)}
                        sonarqubeUrl={sonarqubeLink}
                        auditTrigger={auditTrigger}
                    />
                ) : null;
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
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fa_100%)] px-5 py-5 shadow-sm md:px-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Reporting workspace
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                            Review branches, report categories, and audit history without losing the main health story.
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                            Keep operational context pinned on the left, use the toolbar to switch scope, and move through category reports with GitHub-style clarity instead of dashboard clutter.
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-3 w-full">
                    {isAppDetailsInfosLoading ? (
                        <div className="bg-gray-100 animate-pulse h-80 rounded-xl"></div>
                    ) : appInfos ? (
                        <VitalitySummaryCard appInfos={appInfos} />
                    ) : null}
                </div>

                <div className="lg:col-span-9 w-full">
                    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm md:p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <BranchSelector
                                branches={auditReportBranches}
                                selectedBranch={selectedBranch}
                                onBranchChange={setSelectedBranch}
                            />

                            <Input
                                type="date"
                                className="h-10 w-fit rounded-lg border-slate-300 bg-white text-sm"
                                value={selectedDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSelectedDate(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 shrink-0 rounded-lg border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100"
                                title="Reload"
                            >
                                <ReloadIcon className="w-4 h-4 shrink-0" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 shrink-0 rounded-lg border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100"
                                title="Globe"
                            >
                                <GlobeIcon className="w-4 h-4 shrink-0" />
                            </Button>
                            <Button
                                onClick={onRunAuditClicked}
                                disabled={isRunningAudit}
                                variant="outline"
                                size="sm"
                                className="flex h-10 items-center gap-1.5 rounded-full border-slate-300 bg-slate-950 px-4 text-white hover:bg-slate-800"
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

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:gap-2">
                        <div
                            className="inline-flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
                            role="tablist"
                            aria-label="Details tabs"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                                        activeTab === tab.id
                                            ? 'bg-slate-950 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <Button
                            onClick={onExportClicked}
                            className="h-10 w-full shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 sm:w-auto"
                        >
                            {translate('vitality.appDetailsPage.exportButton')}
                        </Button>
                    </div>
                    </div>

                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default VitalityAppDetailsView;
