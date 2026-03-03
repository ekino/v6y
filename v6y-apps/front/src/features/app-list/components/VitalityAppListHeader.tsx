import { ExportOutlined } from '@v6y/ui-kit';
import { MagnifyingGlassIcon } from '@v6y/ui-kit-front';
import { Button, useTranslationProvider } from '@v6y/ui-kit-front';

const VitalityAppListHeader = ({
    onExportApplicationsClicked,
    searchValue = '',
    onSearchChange,
    appsCount = 0,
}: {
    onExportApplicationsClicked: () => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    appsCount?: number;
}) => {
    const { translate } = useTranslationProvider();

    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4">
            <h2 className="text-lg md:text-2xl font-semibold text-slate-950">
                {translate('vitality.appListPage.projectsListTitle')}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 flex-1 sm:flex-none sm:justify-end">
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-2 sm:p-0 sm:px-4 sm:h-11 bg-white flex-1 sm:flex-none sm:w-56 shadow-sm hover:shadow-md transition-shadow focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-300">
                    <MagnifyingGlassIcon className="w-6 h-6 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="flex-1 outline-none text-base sm:text-sm bg-transparent text-slate-950 placeholder-slate-400"
                    />
                </div>
                <Button
                    onClick={onExportApplicationsClicked}
                    className="w-full sm:w-auto h-10 text-sm"
                >
                    <ExportOutlined className="w-4 h-4" />
                    <span className="ml-2">{translate('vitality.appListPage.exportLabel')}</span>
                </Button>
                <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-right whitespace-nowrap">
                    {appsCount} {appsCount === 1 ? 'result' : 'results'}
                </p>
            </div>
        </div>
    );
};

export default VitalityAppListHeader;
