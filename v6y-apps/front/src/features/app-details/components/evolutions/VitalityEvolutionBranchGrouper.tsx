import * as React from 'react';

import { EvolutionType } from '@v6y/core-logic/src/types/EvolutionType';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@v6y/ui-kit-front/components/molecules/Card';
import useTranslationProvider from '@v6y/ui-kit/translation/useTranslationProvider.ts';

const VitalityEvolutionBranchGrouper = ({ evolutions }: { evolutions: EvolutionType[] }) => {
    const { translate } = useTranslationProvider();

    const evolutionsByBranch = evolutions.reduce(
        (acc, evolution) => {
            const branch = evolution.module?.branch || 'Unknown';
            if (!acc[branch]) {
                acc[branch] = [];
            }
            acc[branch].push(evolution);
            return acc;
        },
        {} as Record<string, EvolutionType[]>,
    );

    return (
        <div className="space-y-6">
            {Object.entries(evolutionsByBranch).map(([branch, branchEvolutions]) => (
                <div key={branch} className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.evolutions.branchTitle')} {branch}
                    </h3>
                    <div className="grid gap-4">
                        {branchEvolutions.map((evolution) => (
                            <Card key={evolution._id} className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium text-slate-900">
                                            {evolution.category || 'Unknown Category'}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {evolution.module?.branch || 'Unknown Branch'}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        {evolution.module?.path && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-500">
                                                    {translate(
                                                        'vitality.appDetailsPage.evolutions.path',
                                                    )}
                                                    :
                                                </span>
                                                <code className="text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                    {evolution.module.path}
                                                </code>
                                            </div>
                                        )}
                                        {evolution.module?.url && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-500">
                                                    {translate(
                                                        'vitality.appDetailsPage.evolutions.repository',
                                                    )}
                                                    :
                                                </span>
                                                <a
                                                    href={evolution.module.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {evolution.module.url}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VitalityEvolutionBranchGrouper;
