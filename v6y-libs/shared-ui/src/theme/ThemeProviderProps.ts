import { ThemeConfig } from 'antd/es/config-provider/context';
import { ReactNode } from 'react';

export interface ThemeProviderProps {
    theme?: ThemeConfig;
    children?: ReactNode;
    enableConfig?: boolean;
    defaultThemeMode?: string;
    defaultTheme?: Record<string, unknown>;
}
