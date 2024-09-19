'use client';

import { RefineThemes } from '@refinedev/antd';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import Cookies from 'js-cookie';
import React, { createContext, useEffect, useState } from 'react';

export const ColorModeContext = createContext({});

export const ColorModeProvider = ({ children, defaultMode }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [mode, setMode] = useState(defaultMode || 'light');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const theme = Cookies.get('theme') || 'light';
            setMode(theme);
        }
    }, [isMounted]);

    const setColorMode = () => {
        if (mode === 'light') {
            setMode('dark');
            Cookies.set('theme', 'dark');
        } else {
            setMode('light');
            Cookies.set('theme', 'light');
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
                    ...RefineThemes.Blue,
                    algorithm: mode === 'light' ? defaultAlgorithm : darkAlgorithm,
                }}
            >
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </ColorModeContext.Provider>
    );
};
