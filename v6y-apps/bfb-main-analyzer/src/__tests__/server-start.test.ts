import express from 'express';
import type { Server } from 'http';
import { expect, test } from 'vitest';

import { ServerUtils } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig';

const { createServer } = ServerUtils;

test('bfb-main-analyzer: starts and stops server', async () => {
    const baseCfg = ServerConfig?.currentConfig || {};
    const cfg = { ...baseCfg, port: 0, serverTimeout: 1000 };
    const app = express();

    const httpServer: Server = createServer({ app, config: cfg });

    await new Promise<void>((resolve, reject) => {
        httpServer.listen({ port: 0 }, () => resolve());
        httpServer.on('error', reject);
    });

    expect(httpServer.listening).toBeTruthy();

    await new Promise<void>((resolve, reject) =>
        httpServer.close((err?: Error) => (err ? reject(err) : resolve())),
    );
});
