import { theme } from 'antd';

import AdminTheme from '../admin/AdminTheme.tsx';
import AppTheme from '../app/AppTheme.tsx';
import { ThemeProps } from '../types/ThemeProps.ts';

export const ThemeTypes = {
    ADMIN_DEFAULT: 'admin-default',
    APP_DEFAULT: 'app-default',
};

export const ThemeModes = {
    LIGHT: 'light',
    DARK: 'dark',
};

/**
 * Load theme based on the theme type
 * @param theme
 */
export const loadTheme = ({ theme }: ThemeProps) => {
    if (theme === ThemeTypes.ADMIN_DEFAULT) {
        return AdminTheme;
    }

    if (theme == ThemeTypes.APP_DEFAULT) {
        return AppTheme;
    }

    return {};
};

/**
 * Use theme hook
 */
export const useTheme = () => {
    const { token } = theme.useToken();

    return {
        themeToken: token,
    };
};
