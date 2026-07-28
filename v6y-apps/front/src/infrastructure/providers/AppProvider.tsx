'use client';

import { useEffect } from 'react';

import { ThemeModes, ThemeProvider, ThemeTypes } from '@v6y/ui-kit';
import { ThemeProps } from '@v6y/ui-kit/src/theme/types/ThemeProps';

import { applyDetectedLocale } from '../translation/i18nHelper';
import QueryProvider from './QueryProvider';

export const AppProvider = ({ children }: ThemeProps) => {
    // Switch to the user's real cached locale only after the initial,
    // hydration-safe render (see i18nHelper.ts for why the app boots with
    // the SSR fallback locale).
    useEffect(() => {
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
