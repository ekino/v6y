import { ApplicationType } from '@v6y/core-logic/src/types';
import { LoaderView, useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

interface VitalityGeneralInformationViewProps {
    appInfos?: ApplicationType;
    isLoading?: boolean;
}

const VitalityGeneralInformationView = ({
    appInfos,
    isLoading = false,
}: VitalityGeneralInformationViewProps) => {
    const { translate } = useTranslationProvider();

    return isLoading ? (
        <LoaderView />
    ) : (
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
                            href={appInfos?.links?.[0]?.value}
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {appInfos?.links?.[0]?.value}
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
            </CardContent>
        </Card>
    );
};

export default VitalityGeneralInformationView;
