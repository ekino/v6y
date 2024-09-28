import { CodeModularityAuditType } from '../types/CodeModularityAuditType.js';
declare const CodeModularityAuditor: {
    startAuditorAnalysis: ({ applicationId, workspaceFolder, }: CodeModularityAuditType) => Promise<boolean>;
};
export default CodeModularityAuditor;
