import * as React from 'react';

import { Text } from '../../atoms/app/Typography';
import { TextType } from '../../types/TextType';

const TextView = ({ content, style, strong, underline }: TextType) => {
    return (
        <Text style={style} strong={strong} underline={underline}>
            {content}
        </Text>
    );
};

export default TextView;
