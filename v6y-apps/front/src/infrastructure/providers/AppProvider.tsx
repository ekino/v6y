'use client';

import { ThemeModes, ThemeProvider, ThemeTypes } from '@v6y/ui-kit';
import { ThemeProps } from '@v6y/ui-kit/src/theme/types/ThemeProps';

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
