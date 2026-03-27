import { Authenticated } from '@refinedev/core';
import * as React from 'react';

type AdminAuthenticatedViewProps = {
    children: React.ReactNode;
    key: string;
};

const AdminAuthenticatedWrapper = ({ children, key }: AdminAuthenticatedViewProps) => (
    <Authenticated key={key}>{children}</Authenticated>
);

export default AdminAuthenticatedWrapper;
