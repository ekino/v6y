import { AuditType } from '@v6y/commons';
import { CodeModularityAuditType, NormalizedProjectTree, ProjectTree } from '../types/CodeModularityAuditType.js';
declare const CodeModularityUtils: {
    GRAPH_OPTIONS: {
        type: string;
        allowSelfLoops: boolean;
        multi: boolean;
    };
    LOUVAIN_ALGO_OPTIONS: {
        resolution: number;
    };
    defaultOptions: {
        fileExtensions: string[];
        excludeRegExp: RegExp[];
    };
    normalizeProjectTree: (tree: ProjectTree) => NormalizedProjectTree;
    retrieveProjectTreeData: (svgBuffer: Buffer) => Promise<{
        title: any;
        x: number;
        y: number;
    }[] | null>;
    formatCodeModularityReports: ({ application, workspaceFolder, modularitySummary, }: CodeModularityAuditType) => AuditType[] | null;
};
export default CodeModularityUtils;
