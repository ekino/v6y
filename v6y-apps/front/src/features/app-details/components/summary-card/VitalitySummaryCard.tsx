import { ApplicationType } from '@v6y/core-logic/src/types';
import { Badge, StarIcon, useTranslationProvider } from '@v6y/ui-kit-front';
import * as React from 'react';

interface VitalitySummaryCardProps {
    appInfos: ApplicationType;
}

const VitalitySummaryCard = ({ appInfos }: VitalitySummaryCardProps) => {
    const { translate } = useTranslationProvider();
    const totalBranches = appInfos.repo?.allBranches?.length || 0;
    const successBranches = 6;
    const warningBranches = 1;  
    const errorBranches = 1;

    return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200  p-6 space-y-4">
            <div className="flex items-center gap-3">
                <StarIcon className="w-6 h-6" />
                <h2 className="text-xl font-bold text-gray-900">{appInfos.name || 'Vitality'}</h2>
            </div>
            
            <div className="text-sm text-gray-600">
                {translate('vitality.appDetailsPage.summaryCard.lastAnalyze').replace('{date}', '01/05/2025')}
            </div>

            <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                    {translate('vitality.appDetailsPage.summaryCard.branchesLabel').replace('{count}', totalBranches.toString())}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="success" className="text-xs">
                        {successBranches} {translate('vitality.appDetailsPage.summaryCard.status.success')}
                    </Badge>
                    <Badge variant="warning" className="text-xs">
                        {warningBranches} {translate('vitality.appDetailsPage.summaryCard.status.warning')}
                    </Badge>
                    <Badge variant="error" className="text-xs">
                        {errorBranches} {translate('vitality.appDetailsPage.summaryCard.status.error')}
                    </Badge>
                </div>
            </div>

            <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                    {translate('vitality.appDetailsPage.summaryCard.technosLabel')}
                </div>
                <div className="flex flex-wrap gap-1">
                    {['React', 'React', 'React', 'React', 'React'].map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs px-2 py-1">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VitalitySummaryCard;
