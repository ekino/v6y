'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button, Input, Label } from '@v6y/ui-kit-front';

import type { FieldConfig } from '../core/resources/types.ts';

/**
 * Repeatable text input list bound to a field holding `string[]` (e.g.
 * Faq/Notification/EvolutionHelp/DependencyStatusHelp/Application `links`).
 *
 * Note: on read, the BFF returns links as `{ label, value, description }[]`,
 * but create/edit mutations accept a flat `[String]` of URLs. The dataProvider
 * consumes whatever this field produces as-is (an array of strings); the show
 * view renders the read-shape separately (see ResourceShow.tsx).
 */
export default function LinksInput({ field }: { field: FieldConfig }) {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: field.name as never });

    return (
        <div className="space-y-2">
            <Label>{field.label}</Label>
            <div className="space-y-2">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <Input
                            {...register(`${field.name}.${index}` as const)}
                            placeholder="https://..."
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            aria-label="Remove link"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
                <Plus className="mr-1 h-4 w-4" />
                Add link
            </Button>
        </div>
    );
}
