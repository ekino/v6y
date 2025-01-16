import { Typography } from 'antd';
import React, { ReactNode } from 'react';

import { useTranslation } from '../../hooks/useTranslation';
import { VitalityText } from '../VitalityText/VitalityText';

interface VitalityTitleProps {
    title: string | ReactNode;
    subTitle?: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
    underline?: boolean;
}

export function VitalityTitle({
    title,
    subTitle,
    level = 2,
    style,
    underline,
}: VitalityTitleProps) {
    const { translate } = useTranslation();
    const translatedTitle = typeof title === 'string' ? translate(title) : title;
    return (
        <Typography.Title style={style} level={level} underline={underline}>
            {translatedTitle}
            {subTitle && (
                <sup>
                    <VitalityText text={subTitle} />
                </sup>
            )}
        </Typography.Title>
    );
}
