import { useThemeConfigProvider } from '@v6y/ui-kit';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    MixerHorizontalIcon,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import {
    DashboardItemType,
    buildDashboardMenuItems,
} from '../../../commons/config/VitalityCommonConfig';
import VitalityDashboardFilterItem from './VitalityDashboardFilterItem';

const VitalityDashboardFilters = () => {
    const { translate } = useTranslationProvider();
    const { currentConfig } = useThemeConfigProvider();

    const menuItems = buildDashboardMenuItems(currentConfig?.token);

    return (
        <aside className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm md:p-5">
            <div className="mb-4 flex items-center gap-x-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
                    <MixerHorizontalIcon width={18} height={18} className="md:w-5 md:h-5" />
                </span>
                <div>
                    <p className="text-base font-semibold text-slate-950 md:text-lg">
                        {translate('vitality.dashboardPage.filters.title')}
                    </p>
                    <p className="text-xs leading-5 text-slate-500 md:text-sm">
                        Open focused views for the stacks and portfolios you review most often.
                    </p>
                </div>
            </div>

            <Accordion type="single" collapsible defaultValue="filters" className="w-full">
                <AccordionItem value="filters" className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
                    <AccordionTrigger className="py-3 text-sm font-medium text-slate-700 hover:text-slate-950 md:text-base">
                        {translate('vitality.dashboardPage.filters.technologies')}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-3 pb-4">
                            {menuItems.map((item: DashboardItemType, index: number) => (
                                <VitalityDashboardFilterItem key={index} option={item} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
};

export default VitalityDashboardFilters;
