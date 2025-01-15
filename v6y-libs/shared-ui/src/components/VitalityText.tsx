import { Typography } from 'antd';
import React, { ReactNode } from 'react';

interface VitalityTextProps {
    text: string | ReactNode;
    style?: React.CSSProperties;
    strong?: boolean;
    underline?: boolean;
}

const VitalityText: React.FC<VitalityTextProps> = ({ text, style, strong, underline }) => {
    return (
        <Typography.Text style={style} strong={strong} underline={underline}>
            {text}
        </Typography.Text>
    );
};

export default VitalityText;
