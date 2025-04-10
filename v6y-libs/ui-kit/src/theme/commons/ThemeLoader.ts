import { ThemeProps } from '../types/ThemeProps.ts';
import AdminTheme from '../variants/admin/AdminTheme.tsx';
import AppTheme from '../variants/app/AppTheme.tsx';

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
