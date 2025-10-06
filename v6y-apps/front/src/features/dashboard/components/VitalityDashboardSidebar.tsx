'use client';

import { useState } from 'react';
import { Searchbar, Filters } from '@v6y/ui-kit-front';

interface FilterSection {
  id: string;
  title: string;
  options: { id: string; label: string; checked?: boolean }[];
  isExpanded: boolean;
}

const VitalityDashboardSidebar = () => {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'technos',
      title: 'Technos',
      isExpanded: true,
      options: [
        { id: 'react', label: 'React', checked: false },
        { id: 'angular', label: 'Angular', checked: false },
        { id: 'vue', label: 'Vue', checked: false },
      ],
    },
    {
      id: 'branches-status',
      title: 'Branches Status',
      isExpanded: false,
      options: [
        { id: 'main', label: 'Main', checked: false },
        { id: 'develop', label: 'Develop', checked: false },
        { id: 'feature', label: 'Feature', checked: false },
      ],
    },
    {
      id: 'performance',
      title: 'Performance',
      isExpanded: false,
      options: [
        { id: 'good', label: 'Good', checked: false },
        { id: 'average', label: 'Average', checked: false },
        { id: 'poor', label: 'Poor', checked: false },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      isExpanded: true,
      options: [
        { id: 'success', label: 'Success', checked: false },
        { id: 'warning', label: 'Warning', checked: false },
        { id: 'error', label: 'Error', checked: false },
      ],
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setFilters(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleOptionChange = (sectionId: string, optionId: string) => {
    setFilters(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map(option =>
                option.id === optionId
                  ? { ...option, checked: !option.checked }
                  : option
              ),
            }
          : section
      )
    );
  };

  return (
    <section className="h-full" aria-label="Sidebar">
      <div className="p-4 space-y-6">
        <Searchbar />
        <Filters
          sections={filters}
          onToggleSection={toggleSection}
          onOptionChange={handleOptionChange}
        />
      </div>
    </section>
  );
};

export default VitalityDashboardSidebar;
