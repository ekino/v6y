import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeSecurityUtils: {
    formatCodeModularityReports: ({ application, workspaceFolder }: AuditCommonsType) => Promise<{
        type: string;
        category: string;
        status: string;
        score: null;
        scoreUnit: string;
        module: {
            path: string;
            appId: number;
            url: string | undefined;
            branch: string | undefined;
        };
    }[]>;
};
export default CodeSecurityUtils;
