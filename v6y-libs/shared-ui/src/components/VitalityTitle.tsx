import { Typography } from 'antd';
import React from 'react';

import { useTranslation } from '../hooks/useTranslation';

interface VitalityTitleProps {
    title: string;
    subTitle?: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
    underline?: boolean;
}

const VitalityTitle: React.FC<VitalityTitleProps> = ({
    title,
    subTitle,
    level = 2,
    style,
    underline,
}) => {
    const { translate } = useTranslation();
    return (
        <Typography.Title style={style} level={level} underline={underline}>
            {translate(title)}
            <sup>
                <Typography.Text>{subTitle}</Typography.Text>
            </sup>
        </Typography.Title>
    );
};

export default VitalityTitle;
