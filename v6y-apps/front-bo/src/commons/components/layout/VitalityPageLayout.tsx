'use client';

import { ThemedLayoutV2 } from '@refinedev/antd';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityTitle from '../../components/VitalityTitle';
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
