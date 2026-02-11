import { Authenticated } from '@refinedev/core';
import * as React from 'react';

type AdminAuthenticatedViewProps = {
    children: React.ReactNode;
};

const AdminAuthenticatedWrapper = ({ children }: AdminAuthenticatedViewProps) => (
    <Authenticated key="authenticated" v3LegacyAuthProviderCompatible={false}>
        {children}
    </Authenticated>
);

export default AdminAuthenticatedWrapper;
