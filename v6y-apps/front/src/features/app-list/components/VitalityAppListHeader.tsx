import { ExportOutlined } from '@v6y/ui-kit';
import { Button, useTranslationProvider } from '@v6y/ui-kit-front';

const VitalityAppListHeader = ({
    onExportApplicationsClicked,
    appsCount = 0,
}: {
    onExportApplicationsClicked: () => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    showSearch?: boolean;
    appsCount?: number;
}) => {
    const { translate } = useTranslationProvider();

    return (
        <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-700">
                    {translate('vitality.appListPage.projectsListTitle')}
                </h2>
                <span className="text-xs text-slate-400">
                    {appsCount} {appsCount === 1 ? 'result' : 'results'}
                </span>
            </div>
            <Button
                onClick={onExportApplicationsClicked}
                variant="outline"
                className="h-8 px-3 text-xs bg-white flex-shrink-0"
            >
                <ExportOutlined className="w-3.5 h-3.5" />
                <span className="ml-1.5">{translate('vitality.appListPage.exportLabel')}</span>
            </Button>
        </div>
    );
};

export default VitalityAppListHeader;
