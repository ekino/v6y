import * as React from 'react';
import { useState } from 'react';

import { AuditType, DependencyType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Badge, Card, CardContent, Check, ChevronDown, Clipboard, Lock } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { resolveNumericId } from '../../../../commons/utils/NumericParamUtils';
import { getDependencyStatusColor } from '../../../../commons/utils/StatusUtils';
import {
    getDependencyLocationText,
    summarizeDependenciesAudit,
} from '../../../../commons/utils/VitalityDependencyUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';
import { matchesAuditReportBranch } from './VitalityAuditReportsBranchFilter';
import { isSecuritySmell } from './VitalityAuditReportsCategoryFilter';
import VitalityDependenciesSummary from './VitalityDependenciesSummary';

const VitalityAuditReportsTypeGrouper = DynamicLoader(
    () => import('./VitalityAuditReportsTypeGrouper'),
);

interface VitalitySecuritySectionProps {
    auditTrigger?: number;
    branch?: string;
    applicationId?: number;
    auditReports?: AuditType[];
}

const VitalitySecuritySection = ({
    auditTrigger = 0,
    branch,
    applicationId,
    auditReports,
}: VitalitySecuritySectionProps) => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate, translateHelper } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);
    const targetApplicationId = resolveNumericId(applicationId, _id as string);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, dependencyId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(dependencyId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const { isLoading: isAppDetailsAuditReportsLoading, data: appDetailsAuditReports } =
        useClientQuery<{ getApplicationDetailsAuditReportsByParams: AuditType[] }>({
            queryCacheKey: [
                'getApplicationDetailsAuditReportsByParams',
                `${targetApplicationId}`,
                `${auditTrigger}`,
            ],
            queryBuilder: async () => {
                if (auditReports?.length) {
                    return {
                        getApplicationDetailsAuditReportsByParams: [],
                    } as { getApplicationDetailsAuditReportsByParams: AuditType[] };
                }

                if (!targetApplicationId) {
                    return {
                        getApplicationDetailsAuditReportsByParams: [],
                    } as { getApplicationDetailsAuditReportsByParams: AuditType[] };
                }

                return buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                    query: GetApplicationDetailsAuditReportsByParams,
                    variables: {
                        _id: targetApplicationId,
                    },
                });
            },
        });

    const { isLoading: isAppDetailsDependenciesLoading, data: appDetailsDependencies } =
        useClientQuery<{ getApplicationDetailsDependenciesByParams: DependencyType[] }>({
            queryCacheKey: [
                'getApplicationDetailsDependenciesByParams',
                `${targetApplicationId}`,
                `${auditTrigger}`,
            ],
            queryBuilder: async () => {
                if (!targetApplicationId) {
                    return {
                        getApplicationDetailsDependenciesByParams: [],
                    } as { getApplicationDetailsDependenciesByParams: DependencyType[] };
                }

                return buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                    query: GetApplicationDetailsDependenciesByParams,
                    variables: {
                        _id: targetApplicationId,
                    },
                });
            },
        });

    // Filter to show static audit reports (exclude lighthouse)
    const sourceAuditReports =
        auditReports || appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams || [];

    const staticAuditReports = sourceAuditReports.filter((report) =>
        auditReports
            ? report.type !== 'Lighthouse'
            : report.type !== 'Lighthouse' && matchesAuditReportBranch(report, branch),
    );

    // Filter security reports
    const securityReports = staticAuditReports.filter((report) => isSecuritySmell(report));

    // Filter dependencies
    const allDependencies = appDetailsDependencies?.getApplicationDetailsDependenciesByParams || [];
    const { dependencies, allDependenciesUpToDate } = summarizeDependenciesAudit(allDependencies);

    const isLoading =
        (!auditReports?.length && isAppDetailsAuditReportsLoading) ||
        isAppDetailsDependenciesLoading;
    const hasContent =
        securityReports.length > 0 ||
        (dependencies && dependencies.length > 0) ||
        allDependenciesUpToDate;

    if (isLoading) {
        return (
            <Card className="border-slate-200 shadow-xs">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="text-sm font-medium text-slate-500">
                        {translate('vitality.appDetailsPage.loadingStates.auditReports')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!hasContent) {
        return (
            <Card className="border-slate-200 shadow-xs">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <Lock className="w-10 h-10 text-slate-400 mb-2" />
                    <div className="text-base font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.emptyStates.auditReports.title')}
                    </div>
                    <div className="text-sm text-slate-500">
                        {translate('vitality.appDetailsPage.emptyStates.auditReports.description')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="space-y-6 border-slate-200 shadow-xs">
            {securityReports.length > 0 && (
                <div data-testid="audit-reports-view">
                    <VitalityAuditReportsTypeGrouper
                        auditReports={securityReports}
                        category="security"
                    />
                </div>
            )}
            {(dependencies && dependencies.length > 0) || allDependenciesUpToDate ? (
                <div data-testid="dependencies-view">
                    <div className="mb-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {translate('vitality.appDetailsPage.dependencies.title')}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {translate('vitality.appDetailsPage.dependencies.description')}
                            </p>
                        </div>
                        {allDependenciesUpToDate ? (
                            <Card className="border-green-200 bg-green-50">
                                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                                    <Check className="w-10 h-10 text-green-600 mb-2" />
                                    <div className="text-base font-semibold text-green-900">
                                        {translate(
                                            'vitality.appDetailsPage.dependencies.success.title',
                                        )}
                                    </div>
                                    <div className="text-sm text-green-700">
                                        {translate(
                                            'vitality.appDetailsPage.dependencies.success.description',
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <VitalityDependenciesSummary dependencies={allDependencies} />
                                <details className="group rounded-lg border overflow-hidden">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-slate-50 px-6 py-3 border-b [&::-webkit-details-marker]:hidden">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {translate(
                                                    'vitality.appDetailsPage.dependencies.table.header',
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {dependencies.length === 1
                                                    ? translateHelper(
                                                          'vitality.appDetailsPage.dependencies.table.itemsCount.one',
                                                          {
                                                              count: dependencies.length,
                                                          },
                                                      )
                                                    : translateHelper(
                                                          'vitality.appDetailsPage.dependencies.table.itemsCount.other',
                                                          {
                                                              count: dependencies.length,
                                                          },
                                                      )}
                                            </p>
                                        </div>
                                        <ChevronDown className="w-4 h-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                                    </summary>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-full">
                                            <thead className="bg-white border-b border-slate-200">
                                                <tr>
                                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                                        {translate(
                                                            'vitality.appDetailsPage.dependencies.table.columns.name',
                                                        )}
                                                    </th>
                                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                                        {translate(
                                                            'vitality.appDetailsPage.dependencies.table.columns.currentVersion',
                                                        )}
                                                    </th>
                                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                                        {translate(
                                                            'vitality.appDetailsPage.dependencies.table.columns.recommendedVersion',
                                                        )}
                                                    </th>
                                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700">
                                                        {translate(
                                                            'vitality.appDetailsPage.dependencies.table.columns.location',
                                                        )}
                                                    </th>
                                                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-700">
                                                        {translate(
                                                            'vitality.appDetailsPage.dependencies.table.columns.status',
                                                        )}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dependencies.map((dependency, index) => (
                                                    <tr
                                                        key={dependency._id || index}
                                                        className={
                                                            index % 2 === 0
                                                                ? 'bg-white'
                                                                : 'bg-slate-50'
                                                        }
                                                    >
                                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                                            {dependency.name || 'Unknown'}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">
                                                            {dependency.version || '-'}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">
                                                            {dependency.recommendedVersion || '-'}
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <div className="max-w-[80px] truncate text-xs">
                                                                    {dependency.module?.branch && (
                                                                        <div>
                                                                            {
                                                                                dependency.module
                                                                                    .branch
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    {dependency.module?.path && (
                                                                        <div className="text-gray-500 truncate">
                                                                            {dependency.module.path}
                                                                        </div>
                                                                    )}
                                                                    {!dependency.module?.branch &&
                                                                        !dependency.module
                                                                            ?.path && (
                                                                            <span className="text-gray-400">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                </div>
                                                                {(dependency.module?.branch ||
                                                                    dependency.module?.path) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            copyToClipboard(
                                                                                getDependencyLocationText(
                                                                                    dependency,
                                                                                ),
                                                                                String(
                                                                                    dependency._id ||
                                                                                        index,
                                                                                ),
                                                                            )
                                                                        }
                                                                        className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
                                                                        title="Copy location"
                                                                    >
                                                                        {copiedId ===
                                                                        String(
                                                                            dependency._id || index,
                                                                        ) ? (
                                                                            <Check className="w-3 h-3 text-green-600" />
                                                                        ) : (
                                                                            <Clipboard className="w-3 h-3 text-gray-500" />
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-sm text-center">
                                                            <Badge
                                                                className={getDependencyStatusColor(
                                                                    dependency.status || '',
                                                                )}
                                                            >
                                                                {dependency.status || 'Unknown'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </Card>
    );
};

export default VitalitySecuritySection;
