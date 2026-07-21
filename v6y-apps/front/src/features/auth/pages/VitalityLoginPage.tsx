'use client';

import * as React from 'react';

import VitalityLoginForm from '../components/VitalityLoginForm';

export default function VitalityLoginPage() {
    return (
        <>
            <style jsx global>{`
                html,
                body {
                    overflow: hidden !important;
                    height: 100%;
                }
            `}</style>

            <div className="fixed inset-x-0 bottom-0 top-[65px] flex items-center justify-center overflow-hidden px-3 md:px-4 lg:px-6">
                <VitalityLoginForm />
            </div>
        </>
    );
}
