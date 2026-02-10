'use client';

import * as React from 'react';
import { Suspense } from 'react';

import AdminErrorView from '@v6y/ui-kit/components/organisms/admin/AdminErrorView';
import AdminAuthenticatedWrapper from '@v6y/ui-kit/components/pages/admin/AdminAuthenticatedWrapper';

export default function NotFound() {
    return (
        <Suspense>
            <AdminAuthenticatedWrapper key="not-found">
                <AdminErrorView />
            </AdminAuthenticatedWrapper>
        </Suspense>
    );
}
