'use client';

import { Controller } from 'react-hook-form';

import { Input } from '../../atoms';
import { ControlledInputType } from '../../types';

const ControlledInput = ({
    name,
    control,
    rules,
    ariaLabel,
    type = 'text',
}: ControlledInputType) => {
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

export default ControlledInput;
