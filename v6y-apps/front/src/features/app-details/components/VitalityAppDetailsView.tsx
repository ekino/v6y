'use client';

import * as React from 'react';

import { ApplicationType, AuditType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Button, GlobeIcon, PlayIcon, ReloadIcon } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { resolveNumericId } from '../../../commons/utils/NumericParamUtils';
import { exportAppDetailsDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import GetAuditRunDetailsByParams from '../api/getAuditRunDetailsByParams';
import VitalityDetailsPageSkeleton from '../components/VitalityDetailsPageSkeleton';
import VitalitySummaryCard from '../components/summary-card/VitalitySummaryCard';
import BranchSelector from './BranchSelector';

const VitalityAuditReportsView = DynamicLoader(
    () => import('./audit-reports/VitalityAuditReportsView'),
);

const VitalitySecuritySection = DynamicLoader(
    () => import('./audit-reports/VitalitySecuritySection'),
);

const VitalitySonarQubeView = DynamicLoader(() => import('./sonarqube/VitalitySonarQubeView'));

interface AuditRunDetailsType {
    _id: number;
    appId: number;
    branch: string | null;
    runStatus: string;
    analysisTypes: string[];
    triggeredAt: string;
    completedAt: string | null;
    errorMessage: string | null;
    audits: AuditType[];
}

interface VitalityAppDetailsViewProps {
    applicationId?: number;
    auditRunId?: number;
}

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

const VitalityAppDetailsView = ({ applicationId, auditRunId }: VitalityAppDetailsViewProps) => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id, reportId] = getUrlParams(['_id', 'reportId']);

    const targetApplicationId = resolveNumericId(applicationId, _id as string);
    const targetAuditRunId = resolveNumericId(auditRunId, reportId as string);

    const [activeTab, setActiveTab] = React.useState('performance');
    const [selectedBranch, setSelectedBranch] = React.useState('');
    const [isRunningAudit, setIsRunningAudit] = React.useState(false);
    const [auditTrigger, setAuditTrigger] = React.useState(0);

    const { isLoading: isAppDetailsInfosLoading, data: appDetailsInfos } = useClientQuery<{
        getApplicationDetailsInfoByParams: ApplicationType | null;
    }>({
        queryCacheKey: ['getApplicationDetailsInfoByParams', `${targetApplicationId ?? 'invalid'}`],
        queryBuilder: async () => {
            if (!targetApplicationId) {
                return {
                    getApplicationDetailsInfoByParams: null,
                };
            }

            return buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationDetailsInfosByParams,
                variables: {
                    _id: targetApplicationId,
                },
            });
        },
    });

    const { isLoading: isAuditRunLoading, data: auditRunDetails } = useClientQuery<{
        getAuditRunDetailsByParams: AuditRunDetailsType | null;
    }>({
        queryCacheKey: ['getAuditRunDetailsByParams', `${targetAuditRunId || 0}`],
        queryBuilder: async () => {
            if (!targetAuditRunId) {
                return {
                    getAuditRunDetailsByParams: null,
                };
            }

            return buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetAuditRunDetailsByParams,
                variables: {
                    _id: targetAuditRunId,
                },
            });
        },
    });

    const appInfos = appDetailsInfos?.getApplicationDetailsInfoByParams ?? undefined;
    const reportDetails = auditRunDetails?.getAuditRunDetailsByParams;
    const reportAudits = reportDetails?.audits || [];
    const reportBranch = reportDetails?.branch || '';
    const auditReportBranches = (appInfos?.repo?.allBranches || []) as string[];

    React.useEffect(() => {
        if (reportBranch) {
            setSelectedBranch(reportBranch);
            return;
        }

        if (!auditReportBranches.length) {
            return;
        }

        if (!auditReportBranches.includes(selectedBranch)) {
            setSelectedBranch(auditReportBranches[0]);
        }
    }, [auditReportBranches, selectedBranch, reportBranch]);

    const sonarqubeLink = getSonarQubeLink(appInfos);

    const tabs = [
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
            case 'performance':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="performance"
                        branch={selectedBranch}
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
            case 'accessibility':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="accessibility"
                        branch={selectedBranch}
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
            case 'security':
                return (
                    <VitalitySecuritySection
                        auditTrigger={auditTrigger}
                        branch={selectedBranch}
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
            case 'maintainability':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="maintainability"
                        branch={selectedBranch}
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
            case 'greenIndex':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="greenIndex"
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
            case 'devops':
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="dora"
                        branch={selectedBranch}
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
            case 'sonarqube':
                return sonarqubeLink ? (
                    <VitalitySonarQubeView
                        applicationId={targetApplicationId}
                        sonarqubeUrl={sonarqubeLink}
                        auditTrigger={auditTrigger}
                    />
                ) : null;
            default:
                return (
                    <VitalityAuditReportsView
                        auditTrigger={auditTrigger}
                        category="performance"
                        branch={selectedBranch}
                        applicationId={targetApplicationId}
                        auditReports={reportAudits}
                    />
                );
        }
    };

    if (isAppDetailsInfosLoading || (!!targetAuditRunId && isAuditRunLoading)) {
        return <VitalityDetailsPageSkeleton />;
    }

    if (!targetApplicationId) {
        return (
            <div className="min-h-screen mt-4 md:px-6 lg:px-0">
                <div className="text-sm text-red-500">Invalid application identifier</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fa_100%)] px-5 py-5 shadow-sm md:px-6">
                <div className="max-w-3xl space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                        Review branches, report categories, and audit history.
                    </h1>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
                <div className="w-full lg:col-span-3">
                    {appInfos ? <VitalitySummaryCard appInfos={appInfos} /> : null}
                </div>

                <div className="w-full lg:col-span-9">
                    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm md:p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <BranchSelector
                                    branches={auditReportBranches}
                                    selectedBranch={selectedBranch}
                                    onBranchChange={setSelectedBranch}
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

                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default VitalityAppDetailsView;
