import { KeywordType } from '@v6y/core-logic/src/types';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';
import { useTranslationProvider } from '@v6y/ui-kit';

const VitalityQualityIndicatorStatusGrouper = ({ indicators }: { indicators: KeywordType[] }) => {
    const { translate } = useTranslationProvider();

    if (!indicators?.length) {
        return (
            <div className="text-center text-slate-500 py-8">
                {translate('vitality.appDetailsPage.emptyStates.qualityIndicators.description')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {indicators.map((indicator, index) => (
                <Card key={`${indicator.label}-${index}`} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-900">
                            {indicator.label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2 text-xs text-slate-600">
                            {indicator.module?.branch && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Branch:</span>
                                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">
                                        {indicator.module.branch}
                                    </span>
                                </div>
                            )}
                            {indicator.module?.status && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Status:</span>
                                    <span className={`px-2 py-1 rounded text-white text-xs ${
                                        indicator.module.status === 'error' ? 'bg-red-500' :
                                        indicator.module.status === 'warning' ? 'bg-yellow-500' :
                                        indicator.module.status === 'success' ? 'bg-green-500' :
                                        'bg-slate-500'
                                    }`}>
                                        {indicator.module.status}
                                    </span>
                                </div>
                            )}
                            {indicator.module?.path && (
                                <div>
                                    <span className="font-medium">Path:</span>
                                    <div className="text-slate-500 break-all mt-1">
                                        {indicator.module.path}
                                    </div>
                                </div>
                            )}
                            {indicator.module?.url && (
                                <div>
                                    <a
                                        href={indicator.module.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                                    >
                                        View Source
                                    </a>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default VitalityQualityIndicatorStatusGrouper;
