import { ThemeConfig } from 'antd/es/config-provider/context';
import { ReactNode } from 'react';

export interface AppProviderProps {
    theme: ThemeConfig;
    children: ReactNode;
}

export interface ThemeProviderProps {
    theme: ThemeConfig;
    children: ReactNode;
}
