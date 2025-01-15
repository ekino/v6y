import { Typography } from 'antd';
import React, { ReactNode } from 'react';

interface VitalityTextProps {
    text: string | ReactNode;
    style?: React.CSSProperties;
    strong?: boolean;
    underline?: boolean;
}

export function VitalityText({ text, style, strong, underline }: VitalityTextProps) {
    return (
        <Typography.Text style={style} strong={strong} underline={underline}>
            {text}
        </Typography.Text>
    );
}
