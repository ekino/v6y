'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { Toaster } from '@v6y/ui-kit-front';

import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="px-4 md:px-16">
                <VitalityPageHeader />
                <VitalityBreadcrumb />
            </div>
            <div className="flex-1 flex items-center justify-center px-4 md:px-16">{children}</div>
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default VitalityPageLayout;
