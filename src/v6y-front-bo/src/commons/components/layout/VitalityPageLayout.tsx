'use client';

import { ThemedLayoutV2 } from '@refinedev/antd';
import { Typography } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityPageFooter from './VitalityPageFooter';
import { VitalityPageHeader } from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
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
