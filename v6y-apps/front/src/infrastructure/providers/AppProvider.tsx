'use client';

import { ThemeProvider } from '@v6y/ui-kit/theme/commons/ThemeProvider.tsx';
import { ThemeProps } from '@v6y/ui-kit/theme/types/ThemeProps.ts';

import {
    ThemeModes,
    ThemeTypes,
} from '../../../../../v6y-libs/ui-kit/src/theme/commons/ThemeLoader';
import QueryProvider from './QueryProvider';

export const AppProvider = ({ children }: ThemeProps) => {
    return (
        <QueryProvider>
            <ThemeProvider
                theme={ThemeTypes.APP_DEFAULT}
                themeMode={ThemeModes.LIGHT}
                config={{ useSSRProvider: true, useConfigProvider: true }}
            >
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
};
