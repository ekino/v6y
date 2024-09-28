declare const ServerConfig: {
    getCurrentConfig: () => {
        serverUrl: string;
        ssl: boolean;
        port: number;
        hostname: string;
        apiPath: string;
        healthCheckPath: string;
        monitoringPath: string;
        serverTimeout: number;
        frontendAuditorApiPath: string;
        databaseUri: string;
        chromeExecutablePath: string;
    };
    getCurrentContext: () => "development" | "production";
};
export default ServerConfig;
