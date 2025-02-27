import * as React from 'react';

import { Text } from '../../atoms';
import { TextType } from '../../types';

const TextView = ({ content, style, strong, underline }: TextType) => {
    return (
        <Text style={style} strong={strong} underline={underline}>
            {content}
        </Text>
    );
};

export default TextView;
