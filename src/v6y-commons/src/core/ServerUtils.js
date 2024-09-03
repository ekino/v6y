import HttpClient from 'http';
import HttpsClient from 'https';
import HttpStaticClient from 'spdy';

/**
 * Creates a static server (presumably for HTTP/2).
 *
 * @param {Object} options - Options for server creation.
 * @param {Object} options.app - The Express application or similar framework instance.
 * @param {Object} options.config - Configuration object containing SSL key and certificate paths.
 * @param {string} options.config.key - Path to the SSL private key file.
 * @param {string} options.config.cert - Path to the SSL certificate file.
 * @returns {Object} The created HTTP/2 server instance.
 */
const createStaticServer = ({ app, config }) => {
    return HttpStaticClient.createServer(
        {
            key: config.key,
            cert: config.cert,
        },
        app,
    );
};

/**
 * Creates an HTTP or HTTPS server based on the provided configuration.
 *
 * @param {Object} options - Options for server creation.
 * @param {Object} options.app - The Express application or similar framework instance.
 * @param {Object} options.config - Configuration object.
 * @param {boolean} options.config.ssl - Whether to create an HTTPS server (true) or HTTP server (false).
 * @param {string} [options.config.key] - Path to the SSL private key file (required if `ssl` is true).
 * @param {string} [options.config.cert] - Path to the SSL certificate file (required if `ssl` is true).
 * @returns {Object} The created HTTP or HTTPS server instance.
 */
const createServer = ({ app, config }) => {
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
