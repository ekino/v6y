'use client';

import { Suspense } from 'react';

import { AdminAuthenticatedWrapper, AdminErrorView } from '@v6y/ui-kit';

export default function NotFound() {
    return (
        <Suspense>
            <AdminAuthenticatedWrapper key="not-found">
                <AdminErrorView />
            </AdminAuthenticatedWrapper>
        </Suspense>
    );
}
