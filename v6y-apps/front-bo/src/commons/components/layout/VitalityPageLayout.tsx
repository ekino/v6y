'use client';

import { VitalityTitle } from '@v6y/shared-ui';
import { AdminLayout } from '@v6y/shared-ui';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityPageFooter from './VitalityPageFooter';
import { VitalityPageHeader } from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <AdminLayout
            title={() => <VitalityTitle level={1} title="V6Y" />}
            header={() => <VitalityPageHeader />}
            footer={() => <VitalityPageFooter />}
        >
            {children}
        </AdminLayout>
    );
};

export default VitalityPageLayout;
