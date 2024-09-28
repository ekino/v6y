import { AuditCommonsType } from './types/AuditCommonsType.js';
declare const FrontendStaticStatusAuditorManager: {
    startFrontendDynamicAudit: ({ applicationId }: AuditCommonsType) => Promise<boolean>;
};
export default FrontendStaticStatusAuditorManager;
