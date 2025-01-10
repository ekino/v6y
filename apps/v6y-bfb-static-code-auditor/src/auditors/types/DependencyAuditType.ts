export interface DependencyAuditParamsType {
    dependencyName?: string;
    dependencyVersion?: string;
    module?: {
        appId: number;
        url: string | undefined;
        branch: string | undefined;
        path: string;
    };
    dependencies?: Record<string, string>;
}
