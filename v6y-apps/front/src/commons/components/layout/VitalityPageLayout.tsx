'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ReactNode } from 'react';

import { Toaster } from '@v6y/ui-kit-front';

import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <div
            className={`min-h-screen bg-[radial-gradient(1200px_520px_at_12%_-8%,#e0ecff_0%,rgba(224,236,255,0)_60%),radial-gradient(1000px_520px_at_100%_0%,#e3f4ff_0%,rgba(227,244,255,0)_58%),linear-gradient(180deg,#f7faff_0%,#f8fafc_40%,#f8fafc_100%)] text-slate-950 ${isLoginPage ? 'overflow-hidden' : ''}`}
        >
            <VitalityPageHeader />

            <div
                className={`mx-auto flex w-full max-w-[96rem] flex-col ${
                    isLoginPage
                        ? 'px-3 pt-3 md:px-4 md:pt-4 lg:px-6'
                        : 'gap-3 px-3 pb-6 pt-3 md:px-4 md:pb-8 md:pt-4 lg:gap-4 lg:px-6'
                }`}
            >
                {!isLoginPage && <VitalityBreadcrumb />}
                <section
                    className={
                        isLoginPage
                            ? 'flex min-h-[calc(100dvh-4.75rem)] items-center justify-center px-0 py-0 md:min-h-[calc(100dvh-5rem)]'
                            : 'min-h-[calc(100vh-6rem)] px-0 py-1 md:min-h-[calc(100vh-6.5rem)] md:py-2'
                    }
                >
                    {children}
                </section>
            </div>

            <Toaster position="top-center" richColors />
        </div>
    );
};

export default VitalityPageLayout;
