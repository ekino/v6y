'use client';

import { useContext } from 'react';

import { ThemeContextType } from '../theme';
import { ThemeConfigProvider } from '../theme/commons/ThemeContext';

export const useThemeConfigProvider = () => {
    const { currentConfig } = useContext<ThemeContextType>(ThemeConfigProvider);

    return {
        currentConfig,
    };
};
