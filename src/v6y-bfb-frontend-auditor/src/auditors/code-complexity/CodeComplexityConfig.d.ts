import { AuditType } from '@v6y/commons';
import { ApplicationCodeComplexityReportType } from '../types/CodeComplexityAuditType.js';
declare const CodeComplexityConfig: {
    formatHalsteadReports: ({ halsteadMetrics, application, analyzedFile, analyzedBranch, }: ApplicationCodeComplexityReportType) => AuditType[];
    formatMaintainabilityStatus: (fileMaintainability: number) => unknown;
    formatMaintainabilityIndexReport: ({ fileMaintainability, application, analyzedFile, analyzedBranch, }: ApplicationCodeComplexityReportType) => AuditType;
    formatCyclomaticComplexityReport: ({ cyclomaticMetric, application, analyzedFile, analyzedBranch, }: ApplicationCodeComplexityReportType) => AuditType;
    formatFileSLOCIndicators: ({ fileSLOC, application, analyzedFile, analyzedBranch, }: ApplicationCodeComplexityReportType) => AuditType[];
    formatCodeComplexitySummary: ({ summary, application, analyzedFile, analyzedBranch, }: ApplicationCodeComplexityReportType) => AuditType;
};
export default CodeComplexityConfig;
