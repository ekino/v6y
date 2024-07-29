import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';

const ThemeProvider = ({ theme, children }) => (
    <AntdRegistry>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </AntdRegistry>
);

export default ThemeProvider;
