import * as React from 'react';
import { ReactNode } from 'react';

import VitalityPageLayout from '../commons/components/layout/VitalityPageLayout';
import VitalityTerms from '../commons/config/VitalityTerms';
import VitalityTheme from '../commons/config/VitalityTheme';
import { AppProvider } from '../infrastructure/providers/AppProvider';

export const metadata = {
    title: VitalityTerms.VITALITY_APP_TITLE,
    description: VitalityTerms.VITALITY_APP_DESCRIPTION,
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
                    <AppProvider theme={VitalityTheme}>
                        <VitalityPageLayout>{children}</VitalityPageLayout>
                    </AppProvider>
                </main>
            </body>
        </html>
    );
}
