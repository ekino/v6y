'use client';

import { ThemedLayoutV2 } from '@refinedev/antd';
import { VitalityTitle } from '@v6y/shared-ui';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityPageFooter from './VitalityPageFooter';
import { VitalityPageHeader } from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <ThemedLayoutV2
            Title={() => (
                <VitalityTitle
                    level={1}
                    style={{
                        marginTop: '1rem',
                    }}
                    title="V6Y"
                />
            )}
            Header={() => <VitalityPageHeader />}
            Footer={() => <VitalityPageFooter />}
        >
            {children}
        </ThemedLayoutV2>
    );
};

export default VitalityPageLayout;
