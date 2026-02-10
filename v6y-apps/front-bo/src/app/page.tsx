'use client';

import * as React from 'react';
import { Suspense } from 'react';

import AdminAuthenticatedWrapper from '@v6y/ui-kit/components/pages/admin/AdminAuthenticatedWrapper';
import AdminNavigationWrapper from '@v6y/ui-kit/components/pages/admin/AdminNavigationWrapper';

export default function IndexPage() {
    return (
        <Suspense>
            <AdminAuthenticatedWrapper key="home-page">
                <AdminNavigationWrapper />
            </AdminAuthenticatedWrapper>
        </Suspense>
    );
}
