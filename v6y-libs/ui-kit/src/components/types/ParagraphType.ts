import * as React from 'react';

export interface ParagraphType {
    content: string | React.ReactNode;
    style?: React.CSSProperties;
    strong?: boolean;
    underline?: boolean;
}
