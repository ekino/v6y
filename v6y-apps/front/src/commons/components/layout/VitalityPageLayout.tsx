'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { Toaster } from '@v6y/ui-kit-front';

import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="px-4 md:px-16">
            <VitalityPageHeader />
            <VitalityBreadcrumb />
            {children}
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default VitalityPageLayout;
