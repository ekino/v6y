import { AuditType } from '@v6y/commons';
import { AuditCommonsType } from '../types/AuditCommonsType.js';
declare const CodeCouplingUtils: {
    formatCodeCouplingReports: ({ application, workspaceFolder, }: AuditCommonsType) => Promise<AuditType[] | null>;
};
export default CodeCouplingUtils;
