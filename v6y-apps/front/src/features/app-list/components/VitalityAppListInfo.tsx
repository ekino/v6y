import { useTranslationProvider } from '@v6y/ui-kit-front';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

const VitalityAppListInfo = () => {
    const { translate } = useTranslationProvider();

    return (
        <div className="w-full">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle>{translate('vitality.appListPage.infoTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-zinc-600 leading-relaxed text-sm">
                        {translate('vitality.appListPage.infoDescription')}
                    </p>
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-200">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                {translate('vitality.appListPage.infoFeature1Title')}
                            </span>
                            <span className="text-sm text-zinc-700">
                                {translate('vitality.appListPage.infoFeature1Desc')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                {translate('vitality.appListPage.infoFeature2Title')}
                            </span>
                            <span className="text-sm text-zinc-700">
                                {translate('vitality.appListPage.infoFeature2Desc')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                {translate('vitality.appListPage.infoFeature3Title')}
                            </span>
                            <span className="text-sm text-zinc-700">
                                {translate('vitality.appListPage.infoFeature3Desc')}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalityAppListInfo;
