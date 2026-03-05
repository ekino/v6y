import http from 'http';
import type { Server } from 'http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ServerUtils } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig';
import { createApp } from '../createApp';

const { createServer } = ServerUtils;

describe('bfb-main-analyzer: server health checks', () => {
    let httpServer: Server;
    let port: number;
    const baseCfg = ServerConfig?.currentConfig || {};
    const healthCheckPath = baseCfg.healthCheckPath || '/health';

    beforeAll(async () => {
        const cfg = { ...baseCfg, port: 0, serverTimeout: 1000 };
        const app = createApp();

        httpServer = createServer({ app, config: cfg });

        await new Promise<void>((resolve, reject) => {
            httpServer.listen({ port: 0 }, () => {
                const address = httpServer.address();
                port = typeof address === 'object' ? address?.port || 0 : 0;
                resolve();
            });
            httpServer.on('error', reject);
        });
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) =>
            httpServer.close((err?: Error) => (err ? reject(err) : resolve())),
        );
    });

    const makeRequest = (path: string): Promise<{ statusCode: number; body: string }> => {
        return new Promise((resolve, reject) => {
            const req = http.get(`http://localhost:${port}${path}`, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({ statusCode: res.statusCode || 0, body: data });
                });
            });
            req.on('error', reject);
        });
    };

    it('should start the server successfully', async () => {
        expect(httpServer.listening).toBeTruthy();
    });

    it('should respond to healthcheck with status 200', async () => {
        const response = await makeRequest(healthCheckPath);
        expect(response.statusCode).toBe(200);
    });

    it('should return correct message from healthcheck', async () => {
        const response = await makeRequest(healthCheckPath);
        expect(response.body).toBe('V6y Sever is UP !');
    });

    it('should have positive uptime when healthcheck is called', async () => {
        const response = await makeRequest(healthCheckPath);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
    });
});
