import { Typography } from 'antd';
import React from 'react';

import { useTranslation } from '../../../src/infrastructure/adapters/translation/TranslationAdapter';

interface VitalityTitleProps {
    title: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
}

const VitalityTitle: React.FC<VitalityTitleProps> = ({ title, level = 2 }) => {
    const { translate } = useTranslation();
    return <Typography.Title level={level}>{translate(title)}</Typography.Title>;
};

export default VitalityTitle;
