import { useThemeConfigProvider } from '@v6y/shared-ui';
import * as React from 'react';

const VitalityPageFooter = () => {
    const { currentConfig } = useThemeConfigProvider();

    return (
        <div
            style={{
                backgroundColor: currentConfig?.token?.colorBgElevated,
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
