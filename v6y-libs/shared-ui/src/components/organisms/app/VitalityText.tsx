import { Typography } from 'antd';
import * as React from 'react';

interface VitalityTextProps {
    text: string | React.ReactNode;
    style?: React.CSSProperties;
    strong?: boolean;
    underline?: boolean;
}

const VitalityText = ({ text, style, strong, underline }: VitalityTextProps) => {
    return (
        <Typography.Text style={style} strong={strong} underline={underline}>
            {text}
        </Typography.Text>
    );
};

export default VitalityText;
