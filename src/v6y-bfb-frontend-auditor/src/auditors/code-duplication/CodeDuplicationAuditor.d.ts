import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeDuplicationAuditor: {
    startAuditorAnalysis: ({ applicationId, workspaceFolder }: AuditCommonsType) => Promise<boolean>;
};
export default CodeDuplicationAuditor;
