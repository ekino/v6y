'use client';

import { Control, Controller } from 'react-hook-form';

import { Input } from '../../atoms';

type VitalityInputProps = {
    name: string;
    control: Control;
    rules: Record<string, unknown>;
    ariaLabel: string;
    type?: string;
};

const VitalityInput = ({ name, control, rules, ariaLabel, type = 'text' }: VitalityInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => {
                if (type === 'password') {
                    return <Input.Password {...field} aria-label={ariaLabel} />;
                }
                return <Input {...field} aria-label={ariaLabel} />;
            }}
        />
    );
};

export default VitalityInput;
