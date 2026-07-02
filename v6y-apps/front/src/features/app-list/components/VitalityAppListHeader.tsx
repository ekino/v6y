import { AppstoreAddOutlined } from '@v6y/ui-kit';
import { Button, useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';

const VitalityAppListHeader = ({
    appsTotal,
    addApplicationUrl,
}: {
    appsTotal: number;
    addApplicationUrl?: string;
}) => {
    const { translate } = useTranslationProvider();
    const targetUrl = addApplicationUrl || VitalityApiConfig.VITALITY_FRONT_BO_URL;

    return (
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <a
                href={targetUrl}
                className="inline-flex w-full md:w-auto justify-center md:justify-start no-underline hover:no-underline"
            >
                <Button className="h-9 md:h-10 text-sm md:text-base">
                    <AppstoreAddOutlined className="w-4 h-4" />
                    <span className="ml-2">
                        {translate('vitality.appListPage.addApplicationLabel') || 'Add Application'}
                    </span>
                </Button>
            </a>
            <p className="text-xs md:text-sm text-slate-600 text-center md:text-right">
                {appsTotal} {appsTotal === 1 ? 'result' : 'results'}
            </p>
        </div>
    );
};

export default VitalityAppListHeader;
