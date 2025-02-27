import * as React from 'react';

import { Paragraph as AtomParagraph } from '../../atoms';
import { ParagraphType } from '../../types';

const Paragraph = ({ content, style, strong, underline }: ParagraphType) => {
    return (
        <AtomParagraph style={style} strong={strong} underline={underline}>
            {content}
        </AtomParagraph>
    );
};

export default Paragraph;
