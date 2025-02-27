'use client';

import { AdminAuthenticatedWrapper, AdminErrorView } from '@v6y/ui-kit';
import * as React from 'react';
import { Suspense } from 'react';

export default function NotFound() {
    return (
        <Suspense>
            <AdminAuthenticatedWrapper key="not-found">
                <AdminErrorView />
            </AdminAuthenticatedWrapper>
        </Suspense>
    );
}
