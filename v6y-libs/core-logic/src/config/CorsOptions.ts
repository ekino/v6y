import AppLogger from '../core/AppLogger.ts';

export const CorsOptions = {
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, origin?: string) => void,
    ) {
        AppLogger.debug(`CORS origin redirect: ${origin}`);
        callback(null, origin);
    },
};
