'use client';

import { ThemedLayoutV2 } from '@refinedev/antd';
import { Typography } from 'antd';
import React from 'react';

import VitalityPageFooter from './VitalityPageFooter.jsx';
import { VitalityPageHeader } from './VitalityPageHeader.jsx';


const VitalityPageLayout = ({ children }) => {
    return (
        <ThemedLayoutV2
            Title={() => (
                <Typography.Title
                    level={1}
                    style={{
                        marginTop: '1rem',
                    }}
                >
                    V6Y
                </Typography.Title>
            )}
            Header={() => <VitalityPageHeader />}
            Footer={() => <VitalityPageFooter />}
        >
            {children}
        </ThemedLayoutV2>
    );
};

export default VitalityPageLayout;
