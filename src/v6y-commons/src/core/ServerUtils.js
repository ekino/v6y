"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const spdy_1 = __importDefault(require("spdy"));
/**
 * Creates a static server (presumably for HTTP/2).
 * @param app
 * @param config
 */
const createStaticServer = ({ app, config }) => {
    return spdy_1.default.createServer({
        key: config.key,
        cert: config.cert,
    }, app);
};
/**
 * Creates a server (HTTP or HTTP/2) based on the configuration.
 * @param app
 * @param config
 */
const createServer = ({ app, config }) => {
    let httpServer;
    if (config.ssl) {
        httpServer = https_1.default.createServer({
            key: config.key,
            cert: config.cert,
        }, app);
    }
    else {
        httpServer = http_1.default.createServer(app);
    }
    return httpServer;
};
/**
 * Utilities for creating HTTP and HTTP/2 servers.
 */
const ServerUtils = {
    createServer,
    createStaticServer,
};
exports.default = ServerUtils;
