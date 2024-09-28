import HttpClient from 'http';
import http from 'http';
import HttpsClient from 'https';
import HttpStaticClient, { IncomingMessage } from 'spdy';

interface ServerConfig {
    app: (request: IncomingMessage, response: http.ServerResponse) => void;
    config: {
        key?: string;
        cert?: string;
        ssl?: boolean;
    };
}

/**
 * Creates a static server (presumably for HTTP/2).
 * @param app
 * @param config
 */
const createStaticServer = ({ app, config }: ServerConfig) => {
    return HttpStaticClient.createServer(
        {
            key: config.key,
            cert: config.cert,
        },
        app,
    );
};

/**
 * Creates a server (HTTP or HTTP/2) based on the configuration.
 * @param app
 * @param config
 */
const createServer = ({ app, config }: ServerConfig) => {
    let httpServer;
    if (config.ssl) {
        httpServer = HttpsClient.createServer(
            {
                key: config.key,
                cert: config.cert,
            },
            app,
        );
    } else {
        httpServer = HttpClient.createServer(app);
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

export default ServerUtils;
