'use client';

import { Authenticated } from '@refinedev/core';
import { NavigateToResource } from '@refinedev/nextjs-router';
import * as React from 'react';
import { Suspense } from 'react';

export default function IndexPage() {
    return (
        <Suspense>
            <Authenticated key="home-page" v3LegacyAuthProviderCompatible={true}>
                <NavigateToResource />
            </Authenticated>
        </Suspense>
    );
}
