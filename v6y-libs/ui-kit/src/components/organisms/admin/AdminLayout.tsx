'use client';

import { ThemedLayoutV2 } from '@refinedev/antd';
import * as React from 'react';

type AdminPageLayoutProps = {
    title: React.FC;
    header?: React.FC;
    footer?: React.FC;
    children: React.ReactNode;
};

const AdminLayout = ({ title, header, footer, children }: AdminPageLayoutProps) => (
    <ThemedLayoutV2 Title={title} Header={header} Footer={footer}>
        {children}
    </ThemedLayoutV2>
);

export default AdminLayout;
