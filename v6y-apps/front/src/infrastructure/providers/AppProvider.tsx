'use client';

import { useEffect } from 'react';

import { ThemeModes, ThemeProvider, ThemeTypes } from '@v6y/ui-kit';
import { ThemeProps } from '@v6y/ui-kit/src/theme/types/ThemeProps';

import { applyDetectedLocale } from '../translation/i18nHelper';
import QueryProvider from './QueryProvider';

export const AppProvider = ({ children }: ThemeProps) => {
    // Apply the browser-detected locale after mount to avoid a hydration
    // mismatch (server renders the fallback 'en', client its cached locale).
    useEffect(function applyBrowserLocaleOnMount() {
        applyDetectedLocale();
    }, []);

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
