import { Typography } from 'antd';
import React from 'react';

import { useTranslation } from '../hooks/useTranslation';

interface VitalityTitleProps {
    title: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
}

const VitalityTitle: React.FC<VitalityTitleProps> = ({ title, level = 2, style }) => {
    const { translate } = useTranslation();
    return <Typography.Title style={style} level={level}>{translate(title)}</Typography.Title>;
};

export default VitalityTitle;
