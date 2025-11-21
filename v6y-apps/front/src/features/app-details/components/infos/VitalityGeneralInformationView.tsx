import { ApplicationType } from '@v6y/core-logic/src/types';
import { LoaderView, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';
import * as React from 'react';

interface VitalityGeneralInformationViewProps {
    appInfos?: ApplicationType;
    isLoading?: boolean;
}

const VitalityGeneralInformationView = ({
    appInfos,
    isLoading = false,
}: VitalityGeneralInformationViewProps) => {
    const { translate } = useTranslationProvider();

    if (isLoading) {
        return <LoaderView />;
    }

    return (
        <Card className="border-slate-200 shadow-md">
            <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                    {translate('vitality.appDetailsPage.infos.title') || 'General Informations'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p data-testid="app-name" className="text-gray-700 leading-relaxed text-base">
                    {translate('vitality.appDetailsPage.infos.description').replace(
                        '{appName}',
                        appInfos?.name || 'Vitality',
                    )}
                </p>

                <div className="space-y-3">
                    <div className="text-sm">
                        <span className="font-semibold text-gray-900">
                            {translate('vitality.appDetailsPage.infos.productionUrl')}
                        </span>{' '}
                        <a
                            href="https://vitality.com"
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://vitality.com
                        </a>
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold text-gray-900">
                            {translate('vitality.appDetailsPage.infos.repository')}
                        </span>{' '}
                        <a
                            href={appInfos?.repo?.gitUrl || 'https://github.com/ekino/v6y'}
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {appInfos?.repo?.gitUrl || 'https://github.com/ekino/v6y'}
                        </a>
                        <div className="text-sm" data-testid="branches-count">
                            {translate('vitality.appDetailsPage.infos.branches').replace(
                                '{count}',
                                (appInfos?.repo?.allBranches?.length ?? 0).toString(),
                            )}
                        </div>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-6 items-start justify-between">
                    {[
                        {
                            label: translate(
                                'vitality.appDetailsPage.infos.indicators.performance',
                            ),
                            value: '90%',
                            grade: 'A',
                            bgColor: 'bg-green-400',
                            textColor: 'text-green-100',
                        },
                        {
                            label: translate(
                                'vitality.appDetailsPage.infos.indicators.accessibility',
                            ),
                            value: '60%',
                            grade: 'B',
                            bgColor: 'bg-orange-400',
                            textColor: 'text-orange-100',
                        },
                        {
                            label: translate('vitality.appDetailsPage.infos.indicators.security'),
                            value: '45%',
                            grade: 'C',
                            bgColor: 'bg-red-500',
                            textColor: 'text-red-100',
                        },
                        {
                            label: translate(
                                'vitality.appDetailsPage.infos.indicators.maintainability',
                            ),
                            value: '85%',
                            grade: 'A',
                            bgColor: 'bg-green-400',
                            textColor: 'text-green-100',
                        },
                        {
                            label: translate('vitality.appDetailsPage.infos.indicators.devops'),
                            value: '90%',
                            grade: 'A',
                            bgColor: 'bg-green-400',
                            textColor: 'text-green-100',
                        },
                    ].map((indicator) => (
                        <div
                            key={indicator.label}
                            className="flex flex-col items-center justify-center overflow-hidden flex-shrink-0"
                        >
                            {/* Value row: percentage + badge inline (horizontal flex, gap-8px, height 28px) */}
                            <div className="flex items-center justify-center gap-2 h-7 px-1.5">
                                <p className="text-xl font-normal leading-7 text-black">
                                    {indicator.value}
                                </p>
                                <div
                                    className={`${indicator.bgColor} ${indicator.textColor} flex items-center justify-center h-5 px-2.5 py-2 rounded-md flex-shrink-0`}
                                >
                                    <p className="text-sm font-medium leading-6">
                                        {indicator.grade}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-black leading-5">
                                {indicator.label}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default VitalityGeneralInformationView;
