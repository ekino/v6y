interface ServerEnvConfig {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath: string;
    frontendStaticAuditorApi: string;
    frontendDynamicAuditorApi: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
}
declare const ServerConfig: {
    getCurrentConfig: () => ServerEnvConfig & {
        serverUrl: string;
    };
    getCurrentContext: () => "development" | "production";
};
export default ServerConfig;
