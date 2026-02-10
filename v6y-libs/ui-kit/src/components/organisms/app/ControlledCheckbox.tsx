'use client';

import { Controller } from 'react-hook-form';

import Checkbox from '../../atoms/app/Checkbox';
import { ControlledCheckboxType } from '../../types/CheckboxType';

const ControlledCheckbox = ({ name, control, ariaLabel }: ControlledCheckboxType) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, ...field } }) => (
                <Checkbox {...field} checked={value}>
                    {ariaLabel}
                </Checkbox>
            )}
        />
    );
};

export default ControlledCheckbox;
