import { AuditType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';

const VitalityAuditReportsTypeGrouper = DynamicLoader(
    () => import('./VitalityAuditReportsTypeGrouper'),
);

interface VitalityAuditReportsViewProps {
    auditTrigger?: number;
    category?: string;
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

const VitalityAuditReportsView = ({
    auditTrigger = 0,
    category,
}: VitalityAuditReportsViewProps) => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);

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

    // Filter to show static audit reports (exclude lighthouse)
    const staticAuditReports =
        appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams?.filter(
            (report) => report.type !== 'Lighthouse',
        ) || [];

    // Filter to show dynamic audit reports (lighthouse only)
    const dynamicAuditReports =
        appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams?.filter(
            (report) => report.type === 'Lighthouse',
        ) || [];

    // Further filter Lighthouse reports by category
    const performanceDynamicReports = dynamicAuditReports.filter(
        (report) => !report.category?.toLowerCase().includes('accessibility'),
    );
    const accessibilityDynamicReports = dynamicAuditReports.filter((report) =>
        report.category?.toLowerCase().includes('accessibility'),
    );

    // Filter static audit reports based on category
    let filteredStaticAuditReports = staticAuditReports;
    if (category === 'performance') {
        // Include all static reports except Code-Complexity, Code-Coupling, Code-Security, Dependencies, Duplication, maintainability-related, accessibility-related, and security smells
        filteredStaticAuditReports = staticAuditReports.filter(
            (report) =>
                report.type !== 'Code-Complexity' &&
                report.type !== 'Code-Coupling' &&
                report.type !== 'Code-Security' &&
                report.type !== 'Dependencies' &&
                report.type !== 'Code-Duplication' &&
                !report.category?.toLowerCase().includes('maintainability') &&
                !report.category?.toLowerCase().includes('modularity') &&
                !report.category?.toLowerCase().includes('duplication') &&
                !report.category?.toLowerCase().includes('accessibility') &&
                !report.type?.toLowerCase().includes('accessibility') &&
                !isSecuritySmell(report),
        );
    } else if (category === 'maintainability') {
        filteredStaticAuditReports = staticAuditReports.filter(
            (report) =>
                report.type === 'Code-Complexity' ||
                report.type === 'Code-Coupling' ||
                report.category?.toLowerCase().includes('maintainability') ||
                report.category?.toLowerCase().includes('modularity') ||
                report.category?.toLowerCase().includes('coupling') ||
                report.category?.toLowerCase().includes('duplication'),
        );
    } else if (category === 'accessibility') {
        filteredStaticAuditReports = staticAuditReports.filter(
            (report) =>
                (report.category?.toLowerCase().includes('accessibility') ||
                    report.type?.toLowerCase().includes('accessibility')) &&
                !report.category?.toLowerCase().includes('performance') &&
                !report.category?.toLowerCase().includes('seo'),
        );
    } else if (category === 'security') {
        // Show security smells based on category prefix patterns (commons-, react-, angular-) or Code-Security type
        filteredStaticAuditReports = staticAuditReports.filter((report) => isSecuritySmell(report));
    }

    // Combine filtered static reports with appropriate dynamic reports
    let allAuditReports: AuditType[] = filteredStaticAuditReports;
    if (category === 'performance') {
        allAuditReports = [...filteredStaticAuditReports, ...performanceDynamicReports];
    } else if (category === 'accessibility') {
        allAuditReports = [...filteredStaticAuditReports, ...accessibilityDynamicReports];
    }

    if (isAppDetailsAuditReportsLoading) {
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

    if (!allAuditReports.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">📋</div>
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
            <VitalityAuditReportsTypeGrouper auditReports={allAuditReports} category={category} />
        </Card>
    );
};

export default VitalityAuditReportsView;
