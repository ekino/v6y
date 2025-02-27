import { Control } from 'react-hook-form';

export type ControlledInputType = {
    name: string;
    control: Control;
    rules: Record<string, unknown>;
    ariaLabel: string;
    type?: string;
};
