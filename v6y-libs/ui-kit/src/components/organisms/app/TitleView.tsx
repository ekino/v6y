import * as React from 'react';

import { Title } from '../../atoms';
import { TitleType } from '../../types';
import TextView from './TextView.tsx';

const TitleView = ({ title, subTitle, level = 2, style, underline }: TitleType) => {
    return (
        <Title style={style} level={level} underline={underline}>
            {title}
            {subTitle && (
                <sup>
                    <TextView content={subTitle} />
                </sup>
            )}
        </Title>
    );
};

export default TitleView;
