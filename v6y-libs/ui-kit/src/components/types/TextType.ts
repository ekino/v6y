import * as React from 'react';

export interface TextType {
    content: string | React.ReactNode;
    style?: React.CSSProperties;
    strong?: boolean;
    underline?: boolean;
}
