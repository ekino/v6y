'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { Toaster } from '@v6y/ui-kit-front';

import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <VitalityPageHeader />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 pb-8 pt-4 md:px-6 md:pb-10 md:pt-5 lg:gap-4 lg:px-8">
                <VitalityBreadcrumb />
                <section className="min-h-[calc(100vh-8rem)] px-0 py-2 md:py-4">
                    {children}
                </section>
            </div>

            <Toaster position="top-center" richColors />
        </div>
    );
};

export default VitalityPageLayout;
