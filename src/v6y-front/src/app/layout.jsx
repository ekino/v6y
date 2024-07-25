import React from 'react';
import { Providers } from './Providers';

export const metadata = {
    title: 'Vitality',
    description:
        'Vitality (v6y) is a web-based application developed by Ekino, designed to maintain and optimize the health and performance of codebases and applications.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>
                    <Providers>{children}</Providers>
                </main>
            </body>
        </html>
    );
}
