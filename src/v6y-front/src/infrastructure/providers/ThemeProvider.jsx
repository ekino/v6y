import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import React from 'react';

const ThemeProvider = ({ theme, children }) => (
    <AntdRegistry>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </AntdRegistry>
);

export default ThemeProvider;
