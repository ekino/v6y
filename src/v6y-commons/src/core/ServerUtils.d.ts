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
 * Utilities for creating HTTP and HTTP/2 servers.
 */
declare const ServerUtils: {
    createServer: ({ app, config }: ServerConfig) => HttpsClient.Server<typeof HttpClient.IncomingMessage, typeof HttpClient.ServerResponse> | HttpClient.Server<typeof HttpClient.IncomingMessage, typeof HttpClient.ServerResponse>;
    createStaticServer: ({ app, config }: ServerConfig) => HttpStaticClient.server.Server;
};
export default ServerUtils;
