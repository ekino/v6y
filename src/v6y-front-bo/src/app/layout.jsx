import { cookies } from 'next/headers';
import React, { Suspense } from 'react';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout.jsx';
import { VitalityApiBaseUrl } from '../commons/config/VitalityApiConfig.js';
import { VitalityPathTree } from '../commons/config/VitalityPathTree.js';
import VitalityTerms from '../commons/config/VitalityTerms.js';
import { AppProvider } from '../infrastructure/providers/AppProvider.jsx';

export const metadata = {
    title: VitalityTerms.VITALITY_META_APP_TITLE,
    description: VitalityTerms.VITALITY_META_APP_DESCRIPTION,
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
                    <AppProvider
                        defaultMode={theme?.value}
                        apiBaseUrl={VitalityApiBaseUrl}
                        resources={VitalityPathTree}
                    >
                        <VitalityPageLayout>{children}</VitalityPageLayout>
                    </AppProvider>
                </Suspense>
            </body>
        </html>
    );
}
