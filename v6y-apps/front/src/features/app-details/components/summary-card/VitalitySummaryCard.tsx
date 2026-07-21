import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { ReloadIcon, useTranslationProvider } from '@v6y/ui-kit-front';

interface VitalitySummaryCardProps {
    appInfos: ApplicationType;
}

const VitalitySummaryCard = ({ appInfos }: VitalitySummaryCardProps) => {
    const { translate } = useTranslationProvider();
    const totalBranches = appInfos.repo?.allBranches?.length || 0;

    return (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm">
            <div className="space-y-4">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {translate('vitality.appDetailsPage.summaryCard.title')}
                </span>

                <div className="min-w-0 space-y-1">
                    <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-950">
                        {appInfos.name || 'Vitality'}
                    </h2>
                    <p className="text-sm leading-6 text-slate-600">
                        {translate('vitality.appDetailsPage.summaryCard.description')}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="inline-flex h-5 w-5 items-center justify-center text-slate-500">
                    <ReloadIcon className="h-4 w-4" />
                </span>
                <span>
                    {translate('vitality.appDetailsPage.summaryCard.lastAnalyze').replace(
                        '{date}',
                        '01/05/2025',
                    )}
                </span>
            </div>

            {totalBranches > 0 && (
                <div className="text-sm font-medium text-slate-700">
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
