import { ApplicationType } from '@v6y/core-logic/src/types';
import { InfoOutlined, useTranslationProvider, LoaderView, EmptyView } from '@v6y/ui-kit';
import { Card, CardContent } from '@v6y/ui-kit-front';
import * as React from 'react';

interface VitalityGeneralInformationViewProps {
    appInfos?: ApplicationType;
    isLoading?: boolean;
}

const VitalityGeneralInformationView = ({ appInfos, isLoading = false }: VitalityGeneralInformationViewProps) => {
    const { translate } = useTranslationProvider();

    if (isLoading) {
        return <LoaderView />;
    }

    if (!appInfos || !appInfos.name || !appInfos.acronym) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <EmptyView />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <InfoOutlined className="text-blue-600 text-lg" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                    {translate('vitality.appDetailsPage.infos.title') || 'General Informations'}
                </h2>
            </div>

            {/* Description and Links */}
            <div className="space-y-4">
                <p data-testid="app-name" className="text-gray-700 leading-relaxed text-base">
                    {appInfos.name} (v6y) is a web-based application developed by Ekino, designed to maintain and optimize the health and performance of codebases
                    and applications. While it is primarily used for Ekino projects, it can also be generalized for use by the wider development community.
                </p>
                
                <div className="space-y-3">
                    <div className="text-sm">
                        <span className="font-semibold text-gray-900">Application production url :</span>{' '}
                        <a href="https://vitality.com" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                            https://vitality.com
                        </a>
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold text-gray-900">Repository :</span>{' '}
                        <a
                            href={appInfos.repo?.gitUrl || 'https://github.com/ekino/v6y'}
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {appInfos.repo?.gitUrl || 'https://github.com/ekino/v6y'}
                        </a>
                        <div className="text-sm" data-testid="branches-count">
                            {`Branches (${appInfos.repo?.allBranches?.length ?? 0})`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quality Metrics Grid */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <div className="grid grid-cols-5 gap-6">
                    {[
                        { label: 'Performance', value: '90%', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                        { label: 'Accessibility', value: '60%', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
                        { label: 'Security', value: '45%', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
                        { label: 'Maintainability', value: '85%', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                        { label: 'DevOps', value: '90%', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                    ].map((metric, idx) => (
                        <div key={idx} className={`text-center p-4 rounded-lg border ${metric.bgColor} ${metric.borderColor}`}>
                            <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
                                {metric.value}
                            </div>
                            <div className="text-sm font-medium text-gray-700">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VitalityGeneralInformationView;
