import { Typography } from 'antd';
import React, { ReactNode } from 'react';

import { useTranslationProvider } from '../../translation/useTranslationProvider.ts';
import VitalityText from '../VitalityText/VitalityText.tsx';

interface VitalityTitleProps {
    title: string | ReactNode;
    subTitle?: string;
    style?: React.CSSProperties;
    level?: 1 | 2 | 3 | 4 | 5 | undefined;
    underline?: boolean;
}

const VitalityTitle = ({ title, subTitle, level = 2, style, underline }: VitalityTitleProps) => {
    const { translate } = useTranslationProvider();
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
};

export default VitalityTitle;
