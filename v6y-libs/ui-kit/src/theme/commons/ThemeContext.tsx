"use client";

import * as React from 'react';
import { ThemeContextType } from '../types/ThemeProps.ts';

export const ThemeConfigProvider = React.createContext<ThemeContextType>({} as ThemeContextType);
