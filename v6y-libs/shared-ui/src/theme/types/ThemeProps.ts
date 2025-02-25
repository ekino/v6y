import { MappingAlgorithm, ThemeConfig } from 'antd';
import { ReactNode } from 'react';

import { ThemeModes, ThemeTypes } from '../commons/ThemeLoader.ts';

export interface ThemeProps {
    theme?: (typeof ThemeTypes)[keyof typeof ThemeTypes];
    themeMode?: (typeof ThemeModes)[keyof typeof ThemeModes];
    themeConfig?: ThemeConfig;
    children?: ReactNode;
    config?: {
        useSSRProvider?: boolean;
        useConfigProvider?: boolean;
    };
}

export type ThemeTokenType = Record<string, unknown>;

type ThemeStatus = {
    status?: Record<string, string>;
    statusIcons?: Record<string, ReactNode>;
};

type ThemeModeAlgorithm = {
    algorithm?: MappingAlgorithm | MappingAlgorithm[] | undefined;
};

export type ThemeContextConfigType = ThemeConfig & ThemeStatus & ThemeModeAlgorithm;

export type ThemeContextType = {
    currentTheme?: string;
    currentConfig?: ThemeContextConfigType;
    onThemeChanged?: (theme: string) => void;
};
