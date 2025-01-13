export interface ServerConfigType {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath?: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
    databaseUri: string;
    chromeExecutablePath?: string;
    devopsAuditorApiPath?: string;
    staticCodeAuditorApiPath?: string;
    urlDynamicAuditorApiPath?: string;
    frontendStaticCodeAuditorApi?: string;
    frontendUrlDynamicAuditorApi?: string;
}

export interface ServerEnvConfigType {
    production: ServerConfigType;
    development: ServerConfigType;
}
