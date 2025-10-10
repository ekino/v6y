import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useTranslationProvider,
  Checkbox,
} from '@v6y/ui-kit-front';

const VitalityDashboardFilters = () => {
  const { translate } = useTranslationProvider();
  const technologies = [
    { id: 0, name: 'React' },
    { id: 1, name: 'Angular' },
    { id: 2, name: 'Vue' },
  ];

  const accessibilityStatuses = [
    { id: 0, name: 'Success' },
    { id: 1, name: 'Warning' },
    { id: 2, name: 'Error' },
  ];

  const branchesStatus = [
    { id: 0, name: 'Stable' },
    { id: 1, name: 'In Development' },
    { id: 2, name: 'Deprecated' },
  ];

  const performanceIndicators = [
    { id: 0, name: 'Good' },
    { id: 1, name: 'Average' },
    { id: 2, name: 'Poor' },
  ];

  return (
    <div className="w-full">
      <p className="text-md mb-4">
        {translate('vitality.dashboardPage.filters.title') || 'Filters :'}
      </p>
      <Accordion
        type="single"
        collapsible
        defaultValue="technologies"
        className="w-full"
      >
        <AccordionItem value="technologies">
          <AccordionTrigger className="py-4 text-lg">
            {translate('vitality.dashboardPage.filters.technologies') ||
              'Technos'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              {technologies.map((tech) => (
                <label key={tech.id} className="flex items-center gap-x-3 py-1">
                  <Checkbox id={`tech-${tech.id}`} />
                  <span className="text-sm">{tech.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-3" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="branches-status">
          <AccordionTrigger className="py-4 text-lg">
            {translate('vitality.dashboardPage.filters.branches') ||
              'Branches Status'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              {branchesStatus.map((branch) => (
                <label
                  key={branch.id}
                  className="flex items-center gap-x-3 py-1"
                >
                  <Checkbox id={`branch-${branch.id}`} />
                  <span className="text-sm">{branch.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-3" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="performance">
          <AccordionTrigger className="py-4 text-lg">
            {translate('vitality.dashboardPage.filters.performance') ||
              'Performance'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              {performanceIndicators.map((indicator) => (
                <label
                  key={indicator.id}
                  className="flex items-center gap-x-3 py-1"
                >
                  <Checkbox id={`perf-${indicator.id}`} />
                  <span className="text-sm">{indicator.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-3" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="qualityStatus">
          <AccordionTrigger className="py-4 text-lg">
            {translate('vitality.dashboardPage.filters.qualityStatus') ||
              'Accessibility'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="py-3">
              {accessibilityStatuses.map((s) => (
                <label key={s.id} className="flex items-center gap-x-3 py-1">
                  <Checkbox id={`acc-${s.id}`} />
                  <span className="text-sm">{s.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default VitalityDashboardFilters;
