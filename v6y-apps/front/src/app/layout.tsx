import { ReactNode, Suspense } from 'react';

import { LoaderView } from '@v6y/ui-kit';
import '@v6y/ui-kit-front/styles.css';
import { graphik } from '@v6y/ui-kit/fonts';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout';
import { AppProvider } from '../infrastructure/providers/AppProvider';
import '../infrastructure/translation/i18nHelper';
import { getServerTranslation } from '../infrastructure/translation/serverTranslation';

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
        <html lang="en" className={graphik.className}>
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
