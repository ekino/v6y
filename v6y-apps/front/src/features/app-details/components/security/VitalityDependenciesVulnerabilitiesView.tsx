import * as React from 'react';

import { DependencyType } from '@v6y/core-logic/src/types';
import { DynamicLoader } from '@v6y/ui-kit';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

const VitalityDependenciesBranchGrouper = DynamicLoader(
    () => import('../dependencies/VitalityDependenciesBranchGrouper'),
);

const VitalityDependenciesVulnerabilitiesView = ({
    dependencies,
}: {
    dependencies: DependencyType[];
}) => {
    const { translate } = useTranslationProvider();

    if (!dependencies?.length) {
        return (
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        {translate('vitality.appDetailsPage.dependenciesVulnerabilities.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-12 gap-2">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-base font-semibold text-slate-900">
                        {translate('vitality.appDetailsPage.emptyStates.dependencies.title')}
                    </div>
                    <div className="text-sm text-slate-500">
                        {translate('vitality.appDetailsPage.emptyStates.dependencies.description')}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {translate('vitality.appDetailsPage.dependenciesVulnerabilities.title')}
                </h2>
            </div>
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-4">
                    <VitalityDependenciesBranchGrouper dependencies={dependencies || []} />
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalityDependenciesVulnerabilitiesView;
