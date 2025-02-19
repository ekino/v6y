'use client';

import { App as AntdApp, ConfigProvider, theme } from 'antd';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Cookie from 'js-cookie';
import * as React from 'react';
import { createContext, useEffect, useState } from 'react';

import { ThemeProviderProps } from './ThemeProviderProps';

export const ColorModeContext = createContext({});

export const ColorModeProvider = ({
    children,
    defaultTheme,
    defaultThemeMode,
}: ThemeProviderProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [mode, setMode] = useState(defaultThemeMode || 'light');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const theme = Cookie.get('theme') || 'light';
            setMode(theme);
        }
    }, [isMounted]);

    const setColorMode = () => {
        if (mode === 'light') {
            setMode('dark');
            Cookie.set('theme', 'dark');
        } else {
            setMode('light');
            Cookie.set('theme', 'light');
        }
    };

    const { darkAlgorithm, defaultAlgorithm } = theme;

    return (
        <ColorModeContext.Provider
            value={{
                setMode: setColorMode,
                mode,
            }}
        >
            <ConfigProvider
                theme={{
                    ...(defaultTheme || {}),
                    algorithm: mode === 'light' ? defaultAlgorithm : darkAlgorithm,
                }}
            >
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </ColorModeContext.Provider>
    );
};
