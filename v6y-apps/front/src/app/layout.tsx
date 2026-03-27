import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';

import { LoaderView } from '@v6y/ui-kit';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout';
import { AppProvider } from '../infrastructure/providers/AppProvider';
import { getServerTranslation } from '../infrastructure/translation/serverTranslation';
import '../styles.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export async function generateMetadata() {
    const title = await getServerTranslation('vitality.metadata.title');
    const description = await getServerTranslation('vitality.metadata.description');

    return {
        icons: {
            icon: '/favicon.svg',
        },
        title,
        description,
    };
}

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
