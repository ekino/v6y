import * as React from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import { StarIcon, useTranslationProvider } from '@v6y/ui-kit-front';

interface VitalitySummaryCardProps {
    appInfos: ApplicationType;
}

const VitalitySummaryCard = ({ appInfos }: VitalitySummaryCardProps) => {
    const { translate } = useTranslationProvider();
    const totalBranches = appInfos.repo?.allBranches?.length || 0;

    return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200  p-6 space-y-4">
            <div className="flex items-center gap-3">
                <StarIcon className="w-6 h-6" />
                <h2 className="text-xl font-bold text-gray-900">{appInfos.name || 'Vitality'}</h2>
            </div>

            <div className="text-sm text-gray-600">
                {translate('vitality.appDetailsPage.summaryCard.lastAnalyze').replace(
                    '{date}',
                    '01/05/2025',
                )}
            </div>

            {totalBranches > 0 && (
                <div className="text-sm font-medium text-gray-900 mb-2">
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
