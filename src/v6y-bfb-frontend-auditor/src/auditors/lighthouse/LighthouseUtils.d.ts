import { AuditType } from '@v6y/commons';
import { LighthouseAuditCategoryType, LighthouseAuditMetricType, LighthouseAuditParamsType, LighthouseReportType } from '../types/LighthouseAuditType.js';
declare const LighthouseUtils: {
    isAuditFailed: (status?: string) => boolean;
    formatAuditCategory: (auditCategory: LighthouseAuditCategoryType) => LighthouseReportType | null;
    parseLighthouseAuditReport: (auditReportData?: string | string[] | undefined) => (LighthouseReportType | null)[] | null;
    formatLighthouseReports: ({ reports, application, }: LighthouseAuditParamsType) => AuditType[] | null;
    formatAuditMetric: (auditMetric: LighthouseAuditMetricType) => LighthouseReportType | null;
    isAuditPerformanceFailed: (report: AuditType) => boolean;
    isAuditAccessibilityFailed: (report: AuditType) => boolean;
};
export default LighthouseUtils;
