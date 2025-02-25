import * as React from 'react';
import { Suspense } from 'react';

import AppProvider from '../infrastructure/providers/AppProvider';
import '../infrastructure/translation/i18nHelper';

export const metadata = {
    title: 'Vitality Back Office (V6Y BO)',
    description:
        'Vitality (v6y) is a web-based application developed by Ekino, designed to maintain and optimize the health and performance of codebases and applications.',
    icons: {
        icon: '/favicon.ico',
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Suspense>
                    <AppProvider>{children}</AppProvider>
                </Suspense>
            </body>
        </html>
    );
}
