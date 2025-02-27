import { CheckboxOptionType as BaseCheckboxOptionType } from 'antd/es/checkbox/Group';
import { Control } from 'react-hook-form';

export type CheckboxOptionType = BaseCheckboxOptionType;

export type ControlledCheckboxType = {
    name: string;
    control: Control;
    ariaLabel: string;
};
