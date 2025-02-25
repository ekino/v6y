'use client';

import { AdminAuthenticatedWrapper, AdminNavigationWrapper } from '@v6y/shared-ui';
import * as React from 'react';
import { Suspense } from 'react';

export default function IndexPage() {
    return (
        <Suspense>
            <AdminAuthenticatedWrapper key="home-page">
                <AdminNavigationWrapper />
            </AdminAuthenticatedWrapper>
        </Suspense>
    );
}
