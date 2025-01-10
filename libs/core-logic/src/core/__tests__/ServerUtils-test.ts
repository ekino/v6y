// ServerUtils.test.ts
import http from 'http';
import HttpsClient from 'https';
import HttpStaticClient from 'spdy';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ServerUtils from '../ServerUtils.ts';

vi.mock('http');
vi.mock('https');
vi.mock('spdy');

describe('ServerUtils', () => {
    const mockApp = vi.fn();
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
            ServerUtils.createServer({ app: mockApp, config: mockConfig });
            expect(http.createServer).toHaveBeenCalledWith(mockApp);
            expect(HttpsClient.createServer).not.toHaveBeenCalled();
        });

        it('should create an HTTPS server if ssl is true', () => {
            const httpsConfig = { ...mockConfig, ssl: true };
            ServerUtils.createServer({ app: mockApp, config: httpsConfig });
            expect(HttpsClient.createServer).toHaveBeenCalledWith(
                {
                    key: httpsConfig.key,
                    cert: httpsConfig.cert,
                },
                mockApp,
            );
            expect(http.createServer).not.toHaveBeenCalled();
        });
    });

    describe('createStaticServer', () => {
        it('should create a static server with the provided config', () => {
            ServerUtils.createStaticServer({ app: mockApp, config: mockConfig });
            expect(HttpStaticClient.createServer).toHaveBeenCalledWith(
                {
                    key: mockConfig.key,
                    cert: mockConfig.cert,
                },
                mockApp,
            );
        });
    });
});
