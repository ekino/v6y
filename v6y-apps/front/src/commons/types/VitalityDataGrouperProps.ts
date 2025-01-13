import { ReactNode } from 'react';

export interface VitalityDataGrouperProps {
    name?: string;
    hasAllGroup?: boolean;
    dataSource: unknown[];
    criteria: string;
    align?: 'start' | 'center' | 'end';
    ariaLabelledby?: string;
    placeholder?: string;
    label?: ReactNode;
    helper?: string;
    disabled?: boolean;
    onRenderChildren?: (key: string, values: unknown[]) => ReactNode;
    onGroupChanged?: (activeTabKey: string) => void;
}
