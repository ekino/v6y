import React from 'react';
import { ConfigProvider } from 'antd';
import theme from './theme.js';

const ThemeConfigProvider = ({ children }) => (
    <ConfigProvider theme={theme}>{children}</ConfigProvider>
);

export default ThemeConfigProvider;
