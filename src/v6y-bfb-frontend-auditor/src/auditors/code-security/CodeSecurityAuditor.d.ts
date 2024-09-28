import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeSecurityAuditor: {
    startAuditorAnalysis: ({ applicationId, workspaceFolder }: AuditCommonsType) => Promise<boolean>;
};
export default CodeSecurityAuditor;
