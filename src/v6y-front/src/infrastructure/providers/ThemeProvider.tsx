import { ThemeProviderProps } from '@/infrastructure/providers/ThemeType';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import * as React from 'react';

const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
    <AntdRegistry>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </AntdRegistry>
);

export default ThemeProvider;
