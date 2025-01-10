import type { ResourceProps } from '@refinedev/core';
import { ReactNode } from 'react';

export interface AppProviderProps {
    defaultMode?: string;
    resources?: ResourceProps[];
    children?: ReactNode;
}
