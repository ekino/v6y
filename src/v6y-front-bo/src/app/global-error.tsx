'use client';

import * as React from 'react';

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <h2>Something went wrong {error}!</h2>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
