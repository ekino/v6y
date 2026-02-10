import { MixerHorizontalIcon } from '@radix-ui/react-icons';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@v6y/ui-kit-front/components/molecules/Accordion';
import useTranslationProvider from '@v6y/ui-kit-front/translation/useTranslationProvider';
import { useThemeConfigProvider } from '@v6y/ui-kit/hooks/useThemeConfigProvider.tsx';

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
            <div className="flex gap-x-2 items-center mb-4">
                <MixerHorizontalIcon width={20} height={20} />
                <p className="font-bold text-2xl">
                    {translate('vitality.dashboardPage.filters.title')}
                </p>
            </div>
            <Accordion type="single" collapsible defaultValue="filters" className="w-full">
                <AccordionItem value="filters" className="border-none">
                    <AccordionTrigger className="py-4 text-md">
                        {translate('vitality.dashboardPage.filters.technologies')}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
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
