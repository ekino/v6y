'use client';

import { ErrorComponent } from '@refinedev/antd';
import { Authenticated } from '@refinedev/core';
import * as React from 'react';
import { Suspense } from 'react';

export default function NotFound() {
    return (
        <Suspense>
            <Authenticated key="not-found" v3LegacyAuthProviderCompatible={true}>
                <ErrorComponent />
            </Authenticated>
        </Suspense>
    );
}
