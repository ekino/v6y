'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import AdminLayout from '@v6y/ui-kit/components/organisms/admin/AdminLayout';
import TitleView from '@v6y/ui-kit/components/organisms/app/TitleView';

import VitalityPageFooter from './VitalityPageFooter';
import { VitalityPageHeader } from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <AdminLayout
            title={() => <TitleView level={1} title="V6Y" />}
            header={() => <VitalityPageHeader />}
            footer={() => <VitalityPageFooter />}
        >
            {children}
        </AdminLayout>
    );
};

export default VitalityPageLayout;
