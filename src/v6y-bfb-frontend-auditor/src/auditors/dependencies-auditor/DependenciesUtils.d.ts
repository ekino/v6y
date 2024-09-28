import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const DependenciesUtils: {
    formatDependenciesReports: ({ application, workspaceFolder }: AuditCommonsType) => Promise<({
        type?: undefined;
        name?: undefined;
        version?: undefined;
        recommendedVersion?: undefined;
        status?: undefined;
        module?: undefined;
    } | {
        type: string;
        name: string;
        version: string;
        recommendedVersion: any;
        status: string;
        module: {
            appId: number;
            url: string | undefined;
            branch: string | undefined;
            path: string;
        } | undefined;
    })[]>;
};
export default DependenciesUtils;
