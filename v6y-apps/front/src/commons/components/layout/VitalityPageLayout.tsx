'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { Toaster } from '@v6y/ui-kit-front';

import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <VitalityPageHeader />
            <div className="mx-auto flex w-full max-w-screen-2xl flex-1 min-h-0 flex-col px-4 md:px-8 lg:px-12">
                <VitalityBreadcrumb />
                <main className="flex flex-1 min-h-0 flex-col pb-8 pt-2 md:pb-12 md:pt-3">
                    {children}
                </main>
            </div>
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default VitalityPageLayout;
