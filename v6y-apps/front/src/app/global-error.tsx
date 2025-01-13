'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <h2>Something went wrong {error.message}!</h2>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
