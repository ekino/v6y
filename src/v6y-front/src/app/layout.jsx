import React from 'react';
import { AppProvider } from '../infrastructure/providers/AppProvider.jsx';
import VitalityTerms from '../commons/config/VitalityTerms.js';
import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout.jsx';
import VitalityTheme from '../commons/config/VitalityTheme.js';

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
