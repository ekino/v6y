import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const DependenciesAuditor: {
    startAuditorAnalysis: ({ applicationId, workspaceFolder }: AuditCommonsType) => Promise<boolean>;
};
export default DependenciesAuditor;
