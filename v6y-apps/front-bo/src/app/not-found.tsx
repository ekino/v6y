'use client';

import { AdminAuthenticatedWrapper } from '@v6y/shared-ui';
import { AdminErrorView } from '@v6y/shared-ui';
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
