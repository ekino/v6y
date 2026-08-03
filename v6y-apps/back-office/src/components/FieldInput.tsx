'use client';

import { useInput } from 'ra-core';

import { Checkbox, Input, Label, Textarea } from '@v6y/ui-kit-front';

import type { FieldConfig } from '../core/resources/types.ts';
import LinksInput from './LinksInput.tsx';

const requiredValidator = (value: unknown) =>
    value === undefined || value === null || value === '' ? 'This field is required' : undefined;

/**
 * Renders the right ui-kit-front control for a given FieldConfig, wired to
 * react-hook-form (via ra-core's useInput) with a label and error message.
 */
export default function FieldInput({ field }: { field: FieldConfig }) {
    const {
        id,
        field: inputField,
        fieldState,
        isRequired,
    } = useInput({
        source: field.name,
        validate: field.required ? requiredValidator : undefined,
    });

    if (field.type === 'links') {
        return <LinksInput field={field} />;
    }

    if (field.type === 'boolean') {
        return (
            <div className="flex items-center gap-2">
                <Checkbox
                    id={id}
                    checked={Boolean(inputField.value)}
                    onCheckedChange={(checked) => inputField.onChange(Boolean(checked))}
                    onBlur={inputField.onBlur}
                />
                <Label htmlFor={id}>
                    {field.label}
                    {isRequired && ' *'}
                </Label>
            </div>
        );
    }

    if (field.type === 'select') {
        return (
            <div className="space-y-2">
                <Label htmlFor={id}>
                    {field.label}
                    {isRequired && ' *'}
                </Label>
                <select
                    id={id}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-2xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                    value={(inputField.value as string) ?? ''}
                    onChange={(event) => inputField.onChange(event.target.value)}
                    onBlur={inputField.onBlur}
                >
                    <option value="" disabled>
                        Select...
                    </option>
                    {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {fieldState.error && (
                    <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
            </div>
        );
    }

    const Control = field.type === 'textarea' ? Textarea : Input;
    const htmlType = field.type === 'password' ? 'password' : 'text';

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {field.label}
                {isRequired && ' *'}
            </Label>
            <Control
                id={id}
                type={htmlType}
                value={(inputField.value as string) ?? ''}
                onChange={(event) => inputField.onChange(event.target.value)}
                onBlur={inputField.onBlur}
                autoComplete={field.type === 'password' ? 'new-password' : undefined}
            />
            {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
            )}
        </div>
    );
}
