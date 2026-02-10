import * as React from 'react';

import { Paragraph as AtomParagraph } from '../../atoms/app/Typography';
import { ParagraphType } from '../../types/ParagraphType';

const Paragraph = ({ content, style, strong, underline }: ParagraphType) => {
    return (
        <AtomParagraph style={style} strong={strong} underline={underline}>
            {content}
        </AtomParagraph>
    );
};

export default Paragraph;
