import * as React from 'react';

import { DependencyType } from '@v6y/core-logic/src/types/DependencyType';
import { useTranslationProvider } from '@v6y/ui-kit';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@v6y/ui-kit-front/components/molecules/Card';

import { getScoreStatusColor, getStatusLabel } from '../../../../commons/utils/StatusUtils';

const VitalityDependenciesBranchGrouper = ({
    dependencies,
}: {
    dependencies: DependencyType[];
}) => {
    const { translate } = useTranslationProvider();

    if (!dependencies?.length) {
        return (
            <div className="text-center text-slate-500 py-8">
                {translate('vitality.appDetailsPage.emptyStates.dependencies.description')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dependencies.map((dependency, index) => (
                    <Card
                        key={`${dependency.name}-${index}`}
                        className="hover:shadow-md transition-shadow border border-slate-200"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-sm font-medium text-slate-900 truncate pr-2">
                                    {dependency.name}
                                </CardTitle>
                                <span
                                    className={`px-2 py-1 rounded text-white text-xs flex-shrink-0 ${getScoreStatusColor(
                                        dependency.status || '',
                                    )}`}
                                >
                                    {getStatusLabel(dependency.status)}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3 text-xs">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-600">Current:</span>
                                        <span className="font-mono text-slate-900">
                                            {dependency.version || 'Unknown'}
                                        </span>
                                    </div>
                                    {dependency.recommendedVersion &&
                                        dependency.recommendedVersion !== dependency.version && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-slate-600">
                                                    Recommended:
                                                </span>
                                                <span className="font-mono text-green-700">
                                                    {dependency.recommendedVersion}
                                                </span>
                                            </div>
                                        )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {dependency.type && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                            {dependency.type.toUpperCase()}
                                        </span>
                                    )}
                                    {dependency.statusHelp?.category && (
                                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                            {dependency.statusHelp.category}
                                        </span>
                                    )}
                                </div>

                                {dependency.module?.branch && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-600">Branch:</span>
                                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">
                                            {dependency.module.branch}
                                        </span>
                                    </div>
                                )}

                                {dependency.statusHelp?.title && (
                                    <div className="border-t pt-2">
                                        <div className="font-medium text-slate-700 mb-1">
                                            {dependency.statusHelp.title}
                                        </div>
                                        {dependency.statusHelp.description && (
                                            <div className="text-slate-600 text-xs leading-relaxed">
                                                {dependency.statusHelp.description}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {dependency.statusHelp?.links &&
                                    dependency.statusHelp.links.length > 0 && (
                                        <div className="space-y-1">
                                            {dependency.statusHelp.links.map((link, linkIndex) => (
                                                <a
                                                    key={linkIndex}
                                                    href={link.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-xs underline block"
                                                    title={link.description}
                                                >
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                {/* File Path */}
                                {dependency.module?.path && (
                                    <div className="border-t pt-2">
                                        <div className="text-slate-500 text-xs break-all">
                                            <span className="font-medium">Path: </span>
                                            {dependency.module.path}
                                        </div>
                                        {dependency.module.url && (
                                            <a
                                                href={dependency.module.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs underline mt-1 inline-block"
                                            >
                                                View in Repository
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VitalityDependenciesBranchGrouper;
