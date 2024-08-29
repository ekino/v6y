import { cookies } from 'next/headers';
import React, { Suspense } from 'react';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout.jsx';
import { VitalityRoutes } from '../commons/config/VitalityNavigationConfig.js';
import { AppProvider } from '../infrastructure/providers/AppProvider.jsx';

export const metadata = {
    title: 'Vitality Back Office (V6Y BO)',
    description:
        'Vitality (v6y) is a web-based application developed by Ekino, designed to maintain and optimize the health and performance of codebases and applications.',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    const cookieStore = cookies();
    const theme = cookieStore.get('theme');

    return (
        <html lang="en">
            <body>
                <Suspense>
                    <AppProvider defaultMode={theme?.value} resources={VitalityRoutes}>
                        <VitalityPageLayout>{children}</VitalityPageLayout>
                    </AppProvider>
                </Suspense>
            </body>
        </html>
    );
}