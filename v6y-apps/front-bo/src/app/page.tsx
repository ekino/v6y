'use client';

import * as React from 'react';
import { Suspense } from 'react';

import { AdminAuthenticatedWrapper, AdminNavigationWrapper } from '@v6y/ui-kit';

export default function IndexPage() {
    return (
        <Suspense>
            <AdminAuthenticatedWrapper>
                <AdminNavigationWrapper />
            </AdminAuthenticatedWrapper>
        </Suspense>
    );
}
