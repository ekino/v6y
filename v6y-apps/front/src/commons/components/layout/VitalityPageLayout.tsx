'use client';

import { Toaster } from '@v6y/ui-kit-front';
import * as React from 'react';
import { ReactNode } from 'react';

import ProtectedRoute from '../ProtectedRoute';
import VitalityBot from '../chatbot/VitalityBot';
import VitalityBreadcrumb from './VitalityBreadcrumb';
import VitalityPageHeader from './VitalityPageHeader';

const VitalityPageLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <VitalityPageHeader />
            <ProtectedRoute>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3">
                            <VitalityBreadcrumb />
                        </div>
                        <div className="lg:col-span-2">{children}</div>
                    </div>
                </div>
            </ProtectedRoute>

            <VitalityBot />

            {/* Simple back-to-top button replacement for FloatButton.BackTop */}
            <button
                aria-label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed right-6 bottom-6 inline-flex items-center justify-center rounded-full bg-gray-800 text-white p-3 shadow-lg hover:bg-gray-700"
            >
                ↑
            </button>

            <Toaster position="top-center" richColors />
        </>
    );
};

export default VitalityPageLayout;
