import { CodeDuplicationAuditType } from '../types/CodeDuplicationAuditType.js';
declare const CodeDuplicationUtils: {
    formatCodeDuplicationReports: ({ application, workspaceFolder, duplicationTotalSummary, duplicationFiles, }: CodeDuplicationAuditType) => ({
        type: string;
        category: string;
        status: string;
        score: number | undefined;
        scoreUnit: string;
        module: {
            path: string;
            appId: number;
            url: string | undefined;
            branch: string | undefined;
        };
        extraInfos?: undefined;
    } | {
        type: string;
        category: string;
        status: string;
        score: number;
        scoreUnit: string;
        extraInfos: string;
        module: {
            path: string;
            appId: number;
            url: string | undefined;
            branch: string | undefined;
        };
    })[];
};
export default CodeDuplicationUtils;
