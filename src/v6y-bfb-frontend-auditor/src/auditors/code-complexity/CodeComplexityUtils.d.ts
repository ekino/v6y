import { AuditType } from '@v6y/commons';
import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeComplexityUtils: {
    formatCodeComplexityReports: ({ workspaceFolder, application, }: AuditCommonsType) => AuditType[] | null;
};
export default CodeComplexityUtils;
