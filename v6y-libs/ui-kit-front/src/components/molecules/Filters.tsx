import React from 'react';
import { Checkbox } from '../atoms/checkbox';
import { Label } from '../atoms/label';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '../atoms/accordion';

export type FilterOption = { id: string; label: string; checked?: boolean };
export type FilterSection = {
    id: string;
    title: string;
    options: FilterOption[];
    isExpanded: boolean;
};

export interface FiltersProps {
    sections: FilterSection[];
    onToggleSection: (sectionId: string) => void;
    onOptionChange: (sectionId: string, optionId: string) => void;
}

export const Filters = ({ sections, onToggleSection, onOptionChange }: FiltersProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Filters :</h3>

            <Accordion
                type="multiple"
                value={sections.filter((s) => s.isExpanded).map((s) => s.id)}
                onValueChange={(value) => {
                    const expandedIds = Array.isArray(value) ? value : value ? [value] : [];
                    sections.forEach((section) => {
                        const currently = section.isExpanded;
                        const next = expandedIds.includes(section.id);
                        if (currently !== next) {
                            onToggleSection(section.id);
                        }
                    });
                }}
            >
                {sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="w-full px-4 py-3 flex items-center justify-between text-left rounded-lg border-0">
                          {section.title}
                        </AccordionTrigger>

                        <AccordionContent>
                            <div className="p-4 space-y-3">
                                {section.options.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${section.id}-${option.id}`}
                                            checked={option.checked}
                                            onCheckedChange={() => onOptionChange(section.id, option.id)}
                                        />
                                        <Label htmlFor={`${section.id}-${option.id}`} className="text-sm text-gray-600 cursor-pointer">
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Filters;
