import { TargetIcon, useTranslationProvider } from '@v6y/ui-kit-front';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

const VitalityAppListInfo = () => {
    const { translate } = useTranslationProvider();

    return (
        <div className="w-full">
            <Card className="border border-slate-100 shadow-lg overflow-hidden p-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="w-full h-32 md:w-24 md:h-auto bg-gradient-to-br from-slate-200 to-slate-100 flex justify-center items-center rounded-t-lg md:rounded-t-none md:rounded-l-lg border-b md:border-b-0 md:border-r border-slate-100">
                        <TargetIcon className="w-16 h-16 text-slate-500" />
                    </div>
                    <div className="flex-1 p-5 md:p-8">
                        <CardHeader className="p-0 pb-5">
                            <CardTitle className="text-lg md:text-xl font-bold text-slate-950">
                                {translate('vitality.appListPage.infoTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-5">
                            <p className="text-slate-700 leading-relaxed text-sm">
                                {translate('vitality.appListPage.infoDescription')}
                            </p>
                            <div className="flex flex-col md:flex-row md:flex-wrap gap-5 md:gap-8 pt-5 border-t-2 border-slate-200">
                                <div className="flex flex-col gap-2 flex-1 md:flex-none">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {translate('vitality.appListPage.infoFeature1Title')}
                                    </span>
                                    <span className="text-sm text-slate-800 font-medium">
                                        {translate('vitality.appListPage.infoFeature1Desc')}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 flex-1 md:flex-none">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {translate('vitality.appListPage.infoFeature2Title')}
                                    </span>
                                    <span className="text-sm text-slate-800 font-medium">
                                        {translate('vitality.appListPage.infoFeature2Desc')}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 flex-1 md:flex-none">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {translate('vitality.appListPage.infoFeature3Title')}
                                    </span>
                                    <span className="text-sm text-slate-800 font-medium">
                                        {translate('vitality.appListPage.infoFeature3Desc')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default VitalityAppListInfo;
