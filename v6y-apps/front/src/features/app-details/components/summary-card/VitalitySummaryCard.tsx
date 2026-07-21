import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { StarIcon, useTranslationProvider } from '@v6y/ui-kit-front';

interface VitalitySummaryCardProps {
    appInfos: ApplicationType;
}

const VitalitySummaryCard = ({ appInfos }: VitalitySummaryCardProps) => {
    const { translate } = useTranslationProvider();
    const totalBranches = appInfos.repo?.allBranches?.length || 0;
    const trackedLinks = (appInfos.links || []).filter((link) => typeof link.value === 'string').length;
    const hasContact = Boolean(appInfos.contactMail);

    return (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm">
            <div className="space-y-4">
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    App health summary
                </span>

                <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                        <StarIcon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0 space-y-1">
                        <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-950">
                            {appInfos.name || 'Vitality'}
                        </h2>
                        <p className="text-sm leading-6 text-slate-600">
                            Follow branches, reporting coverage, and the channels attached to this project before drilling into category-level findings.
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {translate('vitality.appDetailsPage.summaryCard.lastAnalyze').replace(
                    '{date}',
                    '01/05/2025',
                )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        Branches tracked
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                        {totalBranches}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        Linked systems
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                        {trackedLinks}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                        Owner channel
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                        {hasContact ? 'Available' : 'Missing'}
                    </p>
                </div>
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
