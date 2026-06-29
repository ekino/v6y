import HttpClient from 'http';
import http from 'http';
import HttpsClient from 'https';

interface ServerConfig {
    app: (request: http.IncomingMessage, response: http.ServerResponse) => void;
    config: {
        key?: string;
        cert?: string;
        ssl?: boolean;
    };
}

/**
 * Creates a server (HTTP or HTTPS) based on the configuration.
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
 * Utilities for creating HTTP and HTTPS servers.
 */
const ServerUtils = {
    createServer,
};

export default ServerUtils;
