import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeComplexityAuditor: {
    startAuditorAnalysis: ({ applicationId, workspaceFolder }: AuditCommonsType) => Promise<boolean>;
};
export default CodeComplexityAuditor;
