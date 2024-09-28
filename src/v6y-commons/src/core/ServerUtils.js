import HttpClient from 'http';
import HttpsClient from 'https';
import HttpStaticClient from 'spdy';
/**
 * Creates a static server (presumably for HTTP/2).
 * @param app
 * @param config
 */
const createStaticServer = ({ app, config }) => {
    return HttpStaticClient.createServer({
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
        httpServer = HttpsClient.createServer({
            key: config.key,
            cert: config.cert,
        }, app);
    }
    else {
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
