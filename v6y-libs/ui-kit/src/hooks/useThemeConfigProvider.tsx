'use client';

import { useContext } from 'react';

import { ThemeConfigProvider } from '../theme/commons/ThemeContext';
import { ThemeContextType } from '../theme/types/ThemeProps';

export const useThemeConfigProvider = () => {
    const { currentConfig } = useContext<ThemeContextType>(ThemeConfigProvider);

    return {
        currentConfig,
    };
};
