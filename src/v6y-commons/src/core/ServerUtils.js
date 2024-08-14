import HttpClient from 'http';
import HttpsClient from 'https';
import HttpStaticClient from 'spdy';

const createStaticServer = ({ app, config }) => {
    // HTTP2, is only available through https
    return HttpStaticClient.createServer(
        {
            key: config.key,
            cert: config.cert,
        },
        app,
    );
};

const createServer = ({ app, config }) => {
    // Create the HTTPS or HTTP server, per configuration
    let httpServer;
    if (config.ssl) {
        // Assumes certificates are in a .ssl folder off of the package root.
        // Make sure these files are secured.
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

const ServerUtils = {
    createServer,
    createStaticServer,
};

export default ServerUtils;
