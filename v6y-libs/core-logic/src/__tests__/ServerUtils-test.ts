// ServerUtils.test.ts
import http from 'http';
import HttpsClient from 'https';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ServerUtils from '../core/ServerUtils.ts';

describe('ServerUtils', () => {
    const mockApp = vi.fn();
    const mockHttpServer = {} as ReturnType<typeof http.createServer> &
        ReturnType<typeof HttpsClient.createServer>;
    const mockConfig = {
        key: 'mock_key',
        cert: 'mock_cert',
        ssl: false,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('createServer', () => {
        it('should create an HTTP server if ssl is false', () => {
            const httpSpy = vi.spyOn(http, 'createServer').mockReturnValue(mockHttpServer);
            const httpsSpy = vi.spyOn(HttpsClient, 'createServer').mockReturnValue(mockHttpServer);

            ServerUtils.createServer({ app: mockApp, config: mockConfig });
            expect(httpSpy).toHaveBeenCalledWith(mockApp);
            expect(httpsSpy).not.toHaveBeenCalled();
        });

        it('should create an HTTPS server if ssl is true', () => {
            const httpSpy = vi.spyOn(http, 'createServer').mockReturnValue(mockHttpServer);
            const httpsSpy = vi.spyOn(HttpsClient, 'createServer').mockReturnValue(mockHttpServer);
            const httpsConfig = { ...mockConfig, ssl: true };

            ServerUtils.createServer({ app: mockApp, config: httpsConfig });

            expect(httpsSpy).toHaveBeenCalledWith(
                {
                    key: httpsConfig.key,
                    cert: httpsConfig.cert,
                },
                mockApp,
            );
            expect(httpSpy).not.toHaveBeenCalled();
        });
    });
});
