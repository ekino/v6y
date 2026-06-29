import { CorsType } from './CorsType.ts';

export interface ServerConfigType {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath?: string;
    monitoringPath: string;
    serverTimeout: number;
    databaseUri: string;
    serverUrl?: string;
    corsOptions?: CorsType;
    chromeExecutablePath?: string;
    devopsAuditorApiPath?: string;
    staticAuditorApiPath?: string;
    dynamicAuditorApiPath?: string;
    sonarqubeAuditorApiPath?: string;
}

export interface ServerEnvConfigType {
    production: ServerConfigType;
    development: ServerConfigType;
}
