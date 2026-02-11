'use client';

import Image from 'next/image';
import * as React from 'react';
import { ReactNode } from 'react';

import { AdminLayout, useAdminGetIdentity } from '@v6y/ui-kit';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    const { data: user } = useAdminGetIdentity();

    const title = React.useCallback(
        () => (
            <Image
                width={150}
                height={40}
                loading="lazy"
                src="/vitality_logo.svg"
                alt="Vitality Logo"
            />
        ),
        [],
    );

    return (
        <AdminLayout title={title} displaySider={!!user}>
            {children}
        </AdminLayout>
    );
};

export default VitalityPageLayout;
