import type { ReactNode } from 'react';

import '@v6y/ui-kit-front/styles.css';

export const metadata = {
    title: 'V6Y Back-office | Manage and Configure Your Codebase Health Audits',
    description:
        'Vitality (v6y) back-office lets admins manage accounts, applications, FAQs, notifications and help content.',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
