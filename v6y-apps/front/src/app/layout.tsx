import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';

import { LoaderView } from '@v6y/ui-kit';
import '@v6y/ui-kit-front/styles.css';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout';
import { AppProvider } from '../infrastructure/providers/AppProvider';
import '../infrastructure/translation/i18nHelper';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

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
        <html lang="en" className={inter.className}>
            <body>
                <main>
                    <AppProvider>
                        <Suspense fallback={<LoaderView />}>
                            <VitalityPageLayout>{children}</VitalityPageLayout>
                        </Suspense>
                    </AppProvider>
                </main>
            </body>
        </html>
    );
}
