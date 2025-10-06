import * as React from 'react';
import { Spinner } from '@v6y/ui-kit-front';
import { ReactNode, Suspense } from 'react';
import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout';
import '../infrastructure/translation/i18nHelper';
import '../style.css';

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
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center h-64">
                                    <Spinner size={40} />
                                </div>
                            }
                        >
                            <VitalityPageLayout>{children}</VitalityPageLayout>
                        </Suspense>
                </main>
            </body>
        </html>
    );
}
