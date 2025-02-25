import { AntdRegistry } from '@ant-design/nextjs-registry';
import { RefineThemes } from '@refinedev/antd';
import { App as AntdApp, theme as AntdTheme, ConfigProvider } from 'antd';
import * as React from 'react';

import { ThemeProps } from '../types/ThemeProps.ts';
import { ThemeModes, loadTheme } from './ThemeLoader.ts';

const ThemeProvider = ({ theme, themeMode, config, children }: ThemeProps) => {
    const { darkAlgorithm, defaultAlgorithm } = AntdTheme;

    const AppTheme = {
        ...(loadTheme({ theme }) || {}),
        algorithm: themeMode === ThemeModes.LIGHT ? defaultAlgorithm : darkAlgorithm,
    };

    if (config?.useSSRProvider) {
        if (config?.useConfigProvider) {
            return (
                <AntdRegistry>
                    <ConfigProvider theme={AppTheme}>
                        <AntdApp>{children}</AntdApp>
                    </ConfigProvider>
                </AntdRegistry>
            );
        }

        return (
            <AntdRegistry>
                <AntdApp>{children}</AntdApp>
            </AntdRegistry>
        );
    }

    if (config?.useConfigProvider) {
        return (
            <ConfigProvider theme={RefineThemes.Green}>
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        );
    }

    return children;
};

export default ThemeProvider;
