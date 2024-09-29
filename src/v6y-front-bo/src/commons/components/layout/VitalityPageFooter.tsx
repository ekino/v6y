import { theme } from 'antd';
import * as React from 'react';

const { useToken } = theme;

const VitalityPageFooter = () => {
    const { token } = useToken();
    return (
        <div
            style={{
                backgroundColor: token.colorBgElevated,
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
