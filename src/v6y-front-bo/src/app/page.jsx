'use client';

import { Authenticated } from '@refinedev/core';
import { NavigateToResource } from '@refinedev/nextjs-router';
import { Suspense } from 'react';


export default function IndexPage() {
    return (
        <Suspense>
            <Authenticated key="home-page">
                <NavigateToResource />
            </Authenticated>
        </Suspense>
    );
}
