'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { Toaster } from '@v6y/ui-kit-front';

import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <div className="px-4 md:px-16 border-b border-slate-200">
                <VitalityPageHeader />
            </div>
            <div className="px-4 md:px-16">
                <VitalityBreadcrumb />
                {children}
                <Toaster position="top-center" richColors />
            </div>
        </div>
    );
};

export default VitalityPageLayout;
