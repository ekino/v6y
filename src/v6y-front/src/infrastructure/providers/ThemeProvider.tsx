import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import * as React from 'react';

import { ThemeProviderProps } from './ThemeType';

const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
    <AntdRegistry>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </AntdRegistry>
);

export default ThemeProvider;
