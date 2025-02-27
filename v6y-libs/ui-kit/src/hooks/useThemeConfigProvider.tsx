'use client';

import { useContext } from 'react';

import { ThemeConfigProvider, ThemeContextType } from '../theme';

export const useThemeConfigProvider = () => {
    const { currentConfig } = useContext<ThemeContextType>(ThemeConfigProvider);

    return {
        currentConfig,
    };
};
