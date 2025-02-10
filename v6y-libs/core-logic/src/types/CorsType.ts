import { CorsOptions as ExpressCorsOptions } from 'cors';

export interface CorsType extends ExpressCorsOptions {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, origin?: string) => void,
    ) => void;
}
