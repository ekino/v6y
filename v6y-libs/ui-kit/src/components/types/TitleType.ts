import * as React from 'react';

export interface TitleType {
    title: string | React.ReactNode;
    subTitle?: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
    underline?: boolean;
}
