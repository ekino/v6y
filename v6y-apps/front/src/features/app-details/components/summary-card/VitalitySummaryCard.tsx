import { ApplicationType } from '@v6y/core-logic/src/types';
import { Badge } from '@v6y/ui-kit-front';
import * as React from 'react';

interface VitalitySummaryCardProps {
    appInfos?: ApplicationType;
}

const VitalitySummaryCard = ({ appInfos }: VitalitySummaryCardProps) => {
    if (!appInfos) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-gray-500">No application data available</div>
            </div>
        );
    }

    // Calculate branches statistics
    const totalBranches = appInfos.repo?.allBranches?.length || 0;
    const successBranches = 6; // This should come from actual data
    const warningBranches = 1; // This should come from actual data  
    const errorBranches = 1; // This should come from actual data

    return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200  p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <h2 className="text-xl font-bold text-gray-900">{appInfos.name || 'Vitality'}</h2>
            </div>
            
            {/* Last Analyze */}
            <div className="text-sm text-gray-600">
                Last analyze 01/05/2025
            </div>

            {/* Branches Status */}
            <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                    Branches ({totalBranches}) :
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="success" className="text-xs">
                        {successBranches} success
                    </Badge>
                    <Badge variant="warning" className="text-xs">
                        {warningBranches} warning
                    </Badge>
                    <Badge variant="error" className="text-xs">
                        {errorBranches} error
                    </Badge>
                </div>
            </div>

            {/* Technologies */}
            <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                    Technos :
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
