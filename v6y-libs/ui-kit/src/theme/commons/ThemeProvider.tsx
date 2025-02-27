'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App as AntdApp, theme as AntdTheme, ConfigProvider } from 'antd';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';

import { ThemeContextConfigType, ThemeContextType, ThemeProps } from '../types/ThemeProps.ts';
import { ThemeModes, loadTheme } from './ThemeLoader.ts';

const { darkAlgorithm, defaultAlgorithm } = AntdTheme;

/**
 * Theme Config Provider
 */
export const ThemeConfigProvider = React.createContext<ThemeContextType>({} as ThemeContextType);

/**
 * Theme Provider Content View
 * @param themeConfig
 * @param config
 * @param children
 * @constructor
 */
const ThemeProviderContentView = ({ themeConfig, config, children }: ThemeProps) => {
    if (config?.useSSRProvider) {
        if (config?.useConfigProvider) {
            return (
                <AntdRegistry>
                    <ConfigProvider theme={themeConfig}>
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
            <ConfigProvider theme={themeConfig}>
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        );
    }

    return children;
};

/**
 * Theme Provider Component
 * @param theme
 * @param themeMode
 * @param config
 * @param children
 * @constructor
 */
export const ThemeProvider = ({ theme, themeMode, config, children }: ThemeProps) => {
    const [currentTheme, setCurrentTheme] = React.useState(theme);
    const [currentConfig, setCurrentConfig] = React.useState<ThemeContextConfigType | undefined>(
        undefined,
    );
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (isMounted) {
            setCurrentTheme(theme);
        }
    }, [isMounted, theme]);

    useEffect(() => {
        if (currentTheme) {
            setCurrentConfig({
                components: undefined,
                cssVar: undefined,
                hashed: false,
                inherit: false,
                status: undefined,
                statusIcons: undefined,
                token: undefined,
                ...(loadTheme({ theme: currentTheme }) || {}),
                algorithm: themeMode === ThemeModes.LIGHT ? defaultAlgorithm : darkAlgorithm,
            });
        }
    }, [currentTheme, themeMode]);

    const onThemeChanged = (theme: string) => {
        setCurrentTheme(theme);
    };

    return (
        <ThemeConfigProvider.Provider
            value={{
                currentTheme,
                currentConfig,
                onThemeChanged,
            }}
        >
            <ThemeProviderContentView themeConfig={currentConfig} config={config}>
                {children}
            </ThemeProviderContentView>
        </ThemeConfigProvider.Provider>
    );
};
