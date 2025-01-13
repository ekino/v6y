export interface ServerConfigType {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath?: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
    databaseUri: string;
    serverUrl?: string;
    chromeExecutablePath?: string;
    devopsAuditorApiPath?: string;
    staticAuditorApiPath?: string;
    dynamicAuditorApiPath?: string;
}

export interface ServerEnvConfigType {
    production: ServerConfigType;
    development: ServerConfigType;
}
