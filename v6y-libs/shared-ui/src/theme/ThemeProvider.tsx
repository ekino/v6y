import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import * as React from 'react';

import { ThemeProviderProps } from './ThemeProviderProps.ts';

export const ThemeProvider = ({ theme, children, enableConfig }: ThemeProviderProps) => (
    <AntdRegistry>
        {enableConfig ? children : <ConfigProvider theme={theme}>{children}</ConfigProvider>}
    </AntdRegistry>
);
