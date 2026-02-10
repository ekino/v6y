import { DependencyType } from '@v6y/core-logic/src/types/DependencyType';
import { useTranslationProvider } from '@v6y/ui-kit';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@v6y/ui-kit-front/components/molecules/Card';

import { getScoreStatusColor } from '../../../../commons/utils/ColorsByStatusUtils';

const VitalityDependenciesStatusGrouper = ({
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
            {dependencies.map((dependency, index) => (
                <Card
                    key={`${dependency.name}-${index}`}
                    className="hover:shadow-md transition-shadow"
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium text-slate-900">
                                {dependency.name}
                            </CardTitle>
                            <span
                                className={`px-2 py-1 rounded text-white text-xs ${getScoreStatusColor(
                                    dependency.status || '',
                                )}`}
                            >
                                {dependency.status || 'Unknown'}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2 text-xs text-slate-600">
                            <div className="flex justify-between">
                                <span>Version: {dependency.version || 'Unknown'}</span>
                                {dependency.recommendedVersion && (
                                    <span>Recommended: {dependency.recommendedVersion}</span>
                                )}
                            </div>
                            {dependency.statusHelp?.title && (
                                <div className="border-t pt-2">
                                    <div className="font-medium text-slate-700">
                                        {dependency.statusHelp.title}
                                    </div>
                                    {dependency.statusHelp.description && (
                                        <div className="text-slate-600 mt-1">
                                            {dependency.statusHelp.description}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default VitalityDependenciesStatusGrouper;
