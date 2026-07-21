import { AppstoreAddOutlined } from '@v6y/ui-kit';
import { Button, useTranslationProvider } from '@v6y/ui-kit-front';

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

    return (
        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                        Projects under watch
                    </h2>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                        {appsTotal} {appsTotal === 1 ? 'result' : 'results'}
                    </span>
                </div>
                <p className="text-sm text-slate-600">
                    Compare repositories, open the right report quickly, and export the current view when needed.
                </p>

                {isDashboard && (
                    <a href={targetUrl} className="inline-flex pt-2 no-underline hover:no-underline">
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
