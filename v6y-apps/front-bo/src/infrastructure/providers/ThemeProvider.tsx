import { AntdRegistry } from '@ant-design/nextjs-registry';
import * as React from 'react';
import { ReactNode } from 'react';

const ThemeProvider = ({ children }: { children: ReactNode }) => (
    <AntdRegistry>{children}</AntdRegistry>
);

export default ThemeProvider;
