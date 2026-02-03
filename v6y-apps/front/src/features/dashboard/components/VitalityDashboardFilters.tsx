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
        <div className="w-full">
            <div className="flex gap-x-2 items-center mb-2 md:mb-3 lg:mb-4">
                <MixerHorizontalIcon width={18} height={18} className="md:w-5 md:h-5" />
                <p className="font-bold text-lg md:text-xl lg:text-2xl">
                    {translate('vitality.dashboardPage.filters.title')}
                </p>
            </div>

            <Accordion type="single" collapsible defaultValue="filters" className="w-full">
                <AccordionItem value="filters" className="border-none">
                    <AccordionTrigger className="py-2 md:py-3 lg:py-4 text-sm md:text-base hover:text-slate-700">
                        {translate('vitality.dashboardPage.filters.technologies')}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
                            {menuItems.map((item: DashboardItemType, index: number) => (
                                <VitalityDashboardFilterItem key={index} option={item} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default VitalityDashboardFilters;
