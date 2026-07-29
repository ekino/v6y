'use client';

import { useQueryClient } from '@tanstack/react-query';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { resolveNumericId } from '../../../commons/utils/NumericParamUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import { useRunApplicationAudit } from '../hooks/useRunApplicationAudit';
import { RunAuditButton, RunningAuditBanner } from './RunAuditControl';
import VitalityDetailsPageSkeleton from './VitalityDetailsPageSkeleton';
import VitalityAiSummaryCard from './ai-summary/VitalityAiSummaryCard';
import VitalitySummaryCard from './summary-card/VitalitySummaryCard';

const VitalityGeneralInformationView = DynamicLoader(
    () => import('./infos/VitalityGeneralInformationView'),
);

const VitalityAuditRunHistoryView = DynamicLoader(
    () => import('./audit-runs/VitalityAuditRunHistoryView'),
);

interface VitalityProjectDetailsViewProps {
    applicationId?: number;
}

const VitalityProjectDetailsView = ({ applicationId }: VitalityProjectDetailsViewProps) => {
    const { getUrlParams } = useNavigationAdapter();
    const { translate } = useTranslationProvider();
    const [_id, source] = getUrlParams(['_id', 'source']);
    const queryClient = useQueryClient();

    const targetApplicationId = resolveNumericId(applicationId, _id as string);

    const { isRunningAudit, onRunAuditClicked } = useRunApplicationAudit(
        targetApplicationId,
        () => {
            queryClient.invalidateQueries({
                queryKey: [
                    'getApplicationDetailsInfoByParams',
                    `${targetApplicationId ?? 'invalid'}`,
                ],
            });
            queryClient.invalidateQueries({
                queryKey: ['getApplicationAuditRunsByParams', `${targetApplicationId}`],
            });
        },
    );

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

    const appInfos = appDetailsInfos?.getApplicationDetailsInfoByParams;

    if (isAppDetailsInfosLoading) {
        return <VitalityDetailsPageSkeleton />;
    }

    if (!targetApplicationId) {
        return (
            <div className="mt-3">
                <div className="text-sm text-red-500">
                    {translate('vitality.appDetailsPage.invalidApplicationIdentifier')}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-7">
                <div className="lg:col-span-4 w-full">
                    {appInfos ? (
                        <div className="space-y-5">
                            <VitalitySummaryCard appInfos={appInfos} />
                            <VitalityAiSummaryCard applicationId={targetApplicationId} />
                        </div>
                    ) : null}
                </div>

                <div className="lg:col-span-8 w-full space-y-7">
                    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-gray-950">
                                {translate('vitality.appDetailsPage.auditControl.title')}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {translate('vitality.appDetailsPage.auditControl.description')}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <RunningAuditBanner isRunningAudit={isRunningAudit} />
                            <RunAuditButton
                                isRunningAudit={isRunningAudit}
                                onRunAuditClicked={onRunAuditClicked}
                            />
                        </div>
                    </div>

                    <VitalityGeneralInformationView appInfos={appInfos} />

                    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 md:px-5 md:py-6">
                        <h2 className="text-lg font-semibold text-gray-950 mb-2">
                            {translate('vitality.appDetailsPage.auditHistory.title')}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            {translate('vitality.appDetailsPage.auditHistory.description')}
                        </p>
                        <VitalityAuditRunHistoryView
                            applicationId={targetApplicationId}
                            source={source as string}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VitalityProjectDetailsView;
