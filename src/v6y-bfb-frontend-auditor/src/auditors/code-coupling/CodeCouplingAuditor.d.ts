import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeCouplingAuditor: {
    startAuditorAnalysis: ({ applicationId, workspaceFolder }: AuditCommonsType) => Promise<boolean>;
};
export default CodeCouplingAuditor;
