import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useTranslationProvider,
} from '@v6y/ui-kit-front';
import { buildDashboardMenuItems, DashboardItemType } from '../../../commons/config/VitalityCommonConfig';
import { useThemeConfigProvider } from '@v6y/ui-kit';
import VitalityDashboardFilterItem from './VitalityDashboardFilterItem';

const VitalityDashboardFilters = () => {
  const { translate } = useTranslationProvider();
  const { currentConfig } = useThemeConfigProvider();

  const menuItems = buildDashboardMenuItems(currentConfig?.token);

  return (
    <div className="w-full">
      <p className="text-lg mb-4">
        {translate('vitality.dashboardPage.filters.title')}
      </p>
      <Accordion
        type="single"
        collapsible
        defaultValue="filters"
        className="w-full"
      >
        <AccordionItem value="filters">
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
