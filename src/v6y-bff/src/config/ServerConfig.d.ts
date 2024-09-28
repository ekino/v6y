type ServerConfig = {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
};
declare const ServerConfig: {
    getCurrentConfig: () => Record<string, unknown>;
    getCurrentContext: () => string;
};
export default ServerConfig;
