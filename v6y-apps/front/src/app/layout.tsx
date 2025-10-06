import * as React from 'react';
import { ReactNode, Suspense } from 'react';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout';
import { AppProvider } from '../infrastructure/providers/AppProvider';
import QueryProvider from '../infrastructure/providers/QueryProvider';
import '../infrastructure/translation/i18nHelper';

export const metadata = {
    title: 'Vitality',
    description:
        'Vitality (v6y) is a web-based application developed by Ekino, designed to maintain and optimize the health and performance of codebases and applications.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <main>
                    <QueryProvider>
                        <AppProvider>
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center h-64">
                                        <svg
                                            className="animate-spin h-10 w-10 text-gray-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                    </div>
                                }
                            >
                                <VitalityPageLayout>{children}</VitalityPageLayout>
                            </Suspense>
                        </AppProvider>
                    </QueryProvider>
                </main>
            </body>
        </html>
    );
}
