import { useTheme } from '@v6y/shared-ui';
import * as React from 'react';

const VitalityPageFooter = () => {
    const { themeToken } = useTheme();

    return (
        <div
            style={{
                backgroundColor: themeToken.colorBgElevated,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '3rem',
            }}
        >
            Custom Footer Content
        </div>
    );
};

export default VitalityPageFooter;
