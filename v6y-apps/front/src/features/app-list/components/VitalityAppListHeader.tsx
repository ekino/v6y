import { AppstoreAddOutlined } from '@v6y/ui-kit';
import { Button, Eye, useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';

const VitalityAppListHeader = ({
    appsTotal,
    addApplicationUrl,
    source,
}: {
    appsTotal: number;
    addApplicationUrl?: string;
    source?: string;
}) => {
    const { translate } = useTranslationProvider();
    const targetUrl = addApplicationUrl || VitalityApiConfig.VITALITY_FRONT_BO_URL;
    const isDashboard = source === 'dashboard';
    const resultsLabel =
        appsTotal === 1
            ? translate('vitality.appListPage.resultsOne')
            : translate('vitality.appListPage.resultsOther');

    return (
        <div
            className={`w-full flex flex-col ${
                isDashboard ? 'gap-3' : 'gap-4 md:flex-row md:items-center md:justify-between'
            }`}
        >
            <div className={isDashboard ? 'space-y-0.5' : 'space-y-1'}>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2">
                        <span
                            className="inline-flex h-8 w-8 items-center justify-center text-slate-600"
                            aria-hidden
                        >
                            <Eye className="h-6 w-6" />
                        </span>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                            {translate('vitality.appListPage.headerTitle')}
                        </h2>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                        {appsTotal} {resultsLabel}
                    </span>
                </div>

                {!isDashboard && (
                    <p className="text-sm text-slate-600">
                        {translate('vitality.appListPage.headerDescription')}
                    </p>
                )}

                {isDashboard && (
                    <a href={targetUrl} className="inline-flex pt-1.5 no-underline hover:no-underline">
                        <Button className="h-9 md:h-10 text-sm md:text-base">
                            <AppstoreAddOutlined className="w-4 h-4" />
                            <span className="ml-2">
                                {translate('vitality.appListPage.addApplicationLabel') ||
                                    'Add Application'}
                            </span>
                        </Button>
                    </a>
                )}
            </div>

            {!isDashboard && (
                <a
                    href={targetUrl}
                    className="inline-flex w-full md:w-auto justify-center md:justify-start no-underline hover:no-underline"
                >
                    <Button className="h-9 md:h-10 text-sm md:text-base">
                        <AppstoreAddOutlined className="w-4 h-4" />
                        <span className="ml-2">
                            {translate('vitality.appListPage.addApplicationLabel') ||
                                'Add Application'}
                        </span>
                    </Button>
                </a>
            )}
        </div>
    );
};

export default VitalityAppListHeader;
