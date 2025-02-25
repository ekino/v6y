import { Typography } from 'antd';
import * as React from 'react';

import VitalityText from './VitalityText';

interface VitalityTitleProps {
    title: string | React.ReactNode;
    subTitle?: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
    underline?: boolean;
}

const VitalityTitle = ({ title, subTitle, level = 2, style, underline }: VitalityTitleProps) => {
    return (
        <Typography.Title style={style} level={level} underline={underline}>
            {title}
            {subTitle && (
                <sup>
                    <VitalityText text={subTitle} />
                </sup>
            )}
        </Typography.Title>
    );
};

export default VitalityTitle;
