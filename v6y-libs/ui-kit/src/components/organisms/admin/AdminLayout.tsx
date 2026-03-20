'use client';

import { ThemedLayout } from '@refinedev/antd';
import * as React from 'react';

type AdminPageLayoutProps = {
    title: React.FC;
    header?: React.FC;
    footer?: React.FC;
    children: React.ReactNode;
};

const AdminLayout = ({ title, header, footer, children }: AdminPageLayoutProps) => (
    <ThemedLayout Title={title} Header={header} Footer={footer}>
        {children}
    </ThemedLayout>
);

export default AdminLayout;
