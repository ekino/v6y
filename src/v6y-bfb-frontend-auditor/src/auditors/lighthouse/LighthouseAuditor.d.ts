import { LighthouseAuditConfigType } from '../types/LighthouseAuditType.js';
declare const LighthouseAuditor: {
    startAuditorAnalysis: ({ applicationId, browserPath }: LighthouseAuditConfigType) => Promise<boolean>;
};
export default LighthouseAuditor;
