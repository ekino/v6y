import { AuditCommonsType } from './types/AuditCommonsType.js';
declare const FrontendStaticStatusAuditorManager: {
    startFrontendStaticAudit: ({ applicationId, workspaceFolder }: AuditCommonsType) => Promise<boolean>;
};
export default FrontendStaticStatusAuditorManager;
