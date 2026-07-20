import { AuditType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent, FileText, SunIcon } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { resolveNumericId } from '../../../../commons/utils/NumericParamUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';
import { matchesAuditReportBranch } from './VitalityAuditReportsBranchFilter';
import { filterAuditReportsByCategory } from './VitalityAuditReportsCategoryFilter';
import VitalityGreenIndexSection from './VitalityGreenIndexSection';

const VitalityAuditReportsTypeGrouper = DynamicLoader(
    () => import('./VitalityAuditReportsTypeGrouper'),
);

interface VitalityAuditReportsViewProps {
    auditTrigger?: number;
    category?: string;
    branch?: string;
    applicationId?: number;
    auditReports?: AuditType[];
}

const VitalityAuditReportsView = ({
    auditTrigger = 0,
    category,
    branch,
    applicationId,
    auditReports,
}: VitalityAuditReportsViewProps) => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id] = getUrlParams(['_id']);
    const targetApplicationId = resolveNumericId(applicationId, _id as string);

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

    const sourceAuditReports =
        auditReports || appDetailsAuditReports?.getApplicationDetailsAuditReportsByParams || [];

    const branchFilteredAuditReports = auditReports
        ? sourceAuditReports
        : sourceAuditReports.filter((report) => matchesAuditReportBranch(report, branch));

    const allAuditReports = filterAuditReportsByCategory(branchFilteredAuditReports, category);

    if (isAppDetailsAuditReportsLoading && !auditReports) {
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

    if (!allAuditReports.length) {
        let emptyTitle = translate('vitality.appDetailsPage.emptyStates.auditReports.title');
        let emptyDescription = translate(
            'vitality.appDetailsPage.emptyStates.auditReports.description',
        );
        let showGreenSun = false;

        if (category === 'greenIndex') {
            emptyTitle = translate('vitality.appDetailsPage.emptyStates.greenIndex.title');
            emptyDescription = translate(
                'vitality.appDetailsPage.emptyStates.greenIndex.description',
            );
            showGreenSun = true;
        }

        return (
            <Card className="border-slate-200 shadow-xs">
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    {showGreenSun ? (
                        <SunIcon className="w-14 h-14 text-yellow-500 mb-2" />
                    ) : (
                        <FileText className="w-10 h-10 text-slate-400 mb-2" />
                    )}
                    <div className="text-base font-semibold text-slate-900">{emptyTitle}</div>
                    <div className="text-sm text-slate-500">{emptyDescription}</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="space-y-6 border-slate-200 shadow-sm">
            {category === 'greenIndex' ? (
                <VitalityGreenIndexSection reports={allAuditReports} />
            ) : (
                <VitalityAuditReportsTypeGrouper
                    auditReports={allAuditReports}
                    category={category}
                />
            )}
        </Card>
    );
};

export default VitalityAuditReportsView;
