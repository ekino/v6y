import { AntdRegistry } from '@ant-design/nextjs-registry';
import React from 'react';

const ThemeProvider = ({ children }) => <AntdRegistry>{children}</AntdRegistry>;

export default ThemeProvider;
