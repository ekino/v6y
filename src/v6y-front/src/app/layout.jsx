import React from 'react';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout.jsx';
import VitalityTerms from '../commons/config/VitalityTerms.js';
import VitalityTheme from '../commons/config/VitalityTheme.js';
import { AppProvider } from '../infrastructure/providers/AppProvider.jsx';

export const metadata = {
    title: VitalityTerms.VITALITY_APP_TITLE,
    description: VitalityTerms.VITALITY_APP_DESCRIPTION,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>
                    <AppProvider theme={VitalityTheme}>
                        <VitalityPageLayout>{children}</VitalityPageLayout>
                    </AppProvider>
                </main>
            </body>
        </html>
    );
}
