import { ReactNode } from 'react';

import { ThemeModes, ThemeTypes } from '../commons/ThemeLoader.ts';

export interface ThemeProps {
    theme?: (typeof ThemeTypes)[keyof typeof ThemeTypes];
    themeMode?: (typeof ThemeModes)[keyof typeof ThemeModes];
    children?: ReactNode;
    config?: {
        useSSRProvider?: boolean;
        useConfigProvider?: boolean;
    };
}
