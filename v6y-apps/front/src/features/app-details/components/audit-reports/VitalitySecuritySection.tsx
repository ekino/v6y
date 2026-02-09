import * as React from 'react';
import { useState } from 'react';

import { AuditType, DependencyType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Badge, Card, CardContent } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';

const VitalityAuditReportsTypeGrouper = DynamicLoader(
    () => import('./VitalityAuditReportsTypeGrouper'),
);

interface VitalitySecuritySectionProps {
    auditTrigger?: number;
}

const isSecuritySmell = (report: AuditType): boolean => {
    const categoryLower = report.category?.toLowerCase() || '';
    // Check if category matches security smell patterns (commons-, react-, angular- prefixes)
    return (
        categoryLower.startsWith('commons-') ||
        categoryLower.startsWith('react-') ||
        categoryLower.startsWith('angular-') ||
        report.type === 'Code-Security'
    );
};

const getDependencyStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('up to date') || statusLower.includes('success')) {
        return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('warning') || statusLower.includes('minor')) {
        return 'bg-yellow-100 text-yellow-800';
    }
    if (
        statusLower.includes('error') ||
        statusLower.includes('major') ||
        statusLower.includes('critical')
    ) {
        return 'bg-red-100 text-red-800';
    }
    return 'bg-slate-100 text-slate-800';
};

const VitalitySecuritySection = ({ auditTrigger = 0 }: VitalitySecuritySectionProps) => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate, translateHelper } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, dependencyId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(dependencyId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getDependencyLocationText = (dependency: DependencyType) => {
        const parts = [];
        if (dependency.module?.branch) parts.push(dependency.module.branch);
        if (dependency.module?.path) parts.push(dependency.module.path);
        return parts.join(' - ');
    };

    const { isLoading: isAppDetailsAuditReportsLoading, data: appDetailsAuditReports } =
        useClientQuery<{ getApplicationDetailsAuditReportsByParams: AuditType[] }>({
            queryCacheKey: [
                'getApplicationDetailsAuditReportsByParams',
                `${_id}`,
                `${auditTrigger}`,
            ],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                    query: GetApplicationDetailsAuditReportsByParams,
                    variables: {
                        _id: parseInt(_id as string, 10),
                    },
                }),
        });

    const { isLoading: isAppDetailsDependenciesLoading, data: appDetailsDependencies } =
        useClientQuery<{ getApplicationDetailsDependenciesByParams: DependencyType[] }>({
            queryCacheKey: ['getApplicationDetailsDependenciesByParams', `${_id}`],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                    query: GetApplicationDetailsDependenciesByParams,
                    variables: {
                        _id: parseInt(_id as string, 10),
                    },
                }),
        });

    // Filter to show static audit reports (exclude lighthouse)
    const staticAuditReports =
        appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams?.filter(
            (report) => report.type !== 'Lighthouse',
        ) || [];

    // Filter security reports
    const securityReports = staticAuditReports.filter((report) => isSecuritySmell(report));

    // Filter dependencies
    const allDependencies = appDetailsDependencies?.getApplicationDetailsDependenciesByParams || [];
    const filteredDependencies = allDependencies
        .filter((dependency) => dependency?.statusHelp?.category && dependency?.statusHelp?.title)
        .filter((dependency) => {
            const status = dependency.status?.toLowerCase() || '';
            return !status.includes('up to date') && !status.includes('up-to-date');
        })
        .map((dependency) => ({
            ...dependency,
            ...dependency?.statusHelp,
            status: dependency.status,
        }));

    const dependencies = filteredDependencies;
    const hasOutdatedDependencies = allDependencies.some((dependency) => {
        const status = dependency.status?.toLowerCase() || '';
        return status.includes('up to date') || status.includes('up-to-date');
    });
    const allDependenciesUpToDate =
        allDependencies.length > 0 && dependencies.length === 0 && hasOutdatedDependencies;

    const isLoading = isAppDetailsAuditReportsLoading || isAppDetailsDependenciesLoading;
    const hasContent =
        securityReports.length > 0 ||
        (dependencies && dependencies.length > 0) ||
        allDependenciesUpToDate;

    if (isLoading) {
        return (
            <Card className="border-slate-200 shadow-sm">
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
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">🔒</div>
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
        <Card className="space-y-6 border-slate-200 shadow-sm">
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
                                    <div className="text-4xl mb-2">✅</div>
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
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-slate-50 px-6 py-3 border-b">
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
                                                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
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
                                                                        {dependency.module.branch}
                                                                    </div>
                                                                )}
                                                                {dependency.module?.path && (
                                                                    <div className="text-gray-500 truncate">
                                                                        {dependency.module.path}
                                                                    </div>
                                                                )}
                                                                {!dependency.module?.branch &&
                                                                    !dependency.module?.path && (
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
                                                                    className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                                                                    title="Copy location"
                                                                >
                                                                    {copiedId ===
                                                                    String(
                                                                        dependency._id || index,
                                                                    ) ? (
                                                                        <span className="text-xs text-green-600">
                                                                            ✓
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-500">
                                                                            📋
                                                                        </span>
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
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </Card>
    );
};

export default VitalitySecuritySection;
