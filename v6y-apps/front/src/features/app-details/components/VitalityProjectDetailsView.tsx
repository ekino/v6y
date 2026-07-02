'use client';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../api/getApplicationDetailsInfosByParams';
import VitalityDetailsPageSkeleton from './VitalityDetailsPageSkeleton';
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

    const parsedAppIdFromUrl = Number.parseInt(_id as string, 10);
    const targetApplicationId = Number.isFinite(applicationId)
        ? applicationId
        : Number.isFinite(parsedAppIdFromUrl)
          ? parsedAppIdFromUrl
          : undefined;

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
            <div className="min-h-screen mt-4 md:px-6 lg:px-0">
                <div className="text-sm text-red-500">Invalid application identifier</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-4 md:px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <div className="lg:col-span-3 w-full">
                    {appInfos ? <VitalitySummaryCard appInfos={appInfos} /> : null}
                </div>

                <div className="lg:col-span-9 w-full space-y-8">
                    <VitalityGeneralInformationView appInfos={appInfos} />

                    <div className="pt-8 border-t border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">
                            {translate('vitality.appDetailsPage.auditHistory.title')}
                        </h2>
                        <p className="text-sm text-slate-600 mb-6">
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
