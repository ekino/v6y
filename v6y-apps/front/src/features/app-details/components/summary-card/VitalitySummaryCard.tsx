import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationLatestAuditRunByParams from '../../api/getApplicationLatestAuditRunByParams';
import { formatDate } from '../audit-runs/VitalityAuditRunHistory';

interface VitalitySummaryCardProps {
    appInfos: ApplicationType;
}

type LatestAuditRun = {
    triggeredAt?: string | null;
    completedAt?: string | null;
};

const VitalitySummaryCard = ({ appInfos }: VitalitySummaryCardProps) => {
    const { translate } = useTranslationProvider();
    const totalBranches = appInfos.repo?.allBranches?.length || 0;

    const { data } = useClientQuery<{
        getApplicationLatestAuditRunByParams: LatestAuditRun | null;
    }>({
        queryCacheKey: [
            'app-details',
            'getApplicationLatestAuditRunByParams',
            String(appInfos._id),
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationLatestAuditRunByParams,
                variables: { _id: appInfos._id },
            }),
    });

    const latestAuditRun = data?.getApplicationLatestAuditRunByParams;
    const lastAnalyzedDate = latestAuditRun?.completedAt ?? latestAuditRun?.triggeredAt;

    return (
        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="space-y-4">
                <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                    {translate('vitality.appDetailsPage.summaryCard.title')}
                </span>

                <div className="min-w-0 space-y-1">
                    <h2 className="truncate text-2xl font-semibold tracking-tight text-gray-950">
                        {appInfos.name || 'Vitality'}
                    </h2>
                    <p className="text-sm leading-6 text-gray-600">
                        {translate('vitality.appDetailsPage.summaryCard.description')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600">
                <span>
                    {lastAnalyzedDate
                        ? translate('vitality.appDetailsPage.summaryCard.lastAnalyze').replace(
                              '{date}',
                              formatDate(lastAnalyzedDate),
                          )
                        : translate('vitality.appDetailsPage.summaryCard.notAnalyzedYet')}
                </span>
            </div>

            {totalBranches > 0 && (
                <div className="text-sm font-medium text-gray-700">
                    {translate('vitality.appDetailsPage.summaryCard.branchesLabel').replace(
                        '{count}',
                        totalBranches.toString(),
                    )}
                </div>
            )}
        </div>
    );
};

export default VitalitySummaryCard;
