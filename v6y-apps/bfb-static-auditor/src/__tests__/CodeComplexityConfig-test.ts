import { describe, expect, it } from 'vitest';

import CodeComplexityConfig from '../auditors/code-complexity/CodeComplexityConfig.ts';
import {
    CodeComplexityReportSummaryType,
    HalsteadMetricType,
} from '../auditors/types/CodeComplexityAuditType.ts';

describe('CodeComplexityConfig', () => {
    it('should format maintainability status correctly', () => {
        expect(CodeComplexityConfig.formatMaintainabilityStatus(60)).toBe('error');
        expect(CodeComplexityConfig.formatMaintainabilityStatus(70)).toBe('warning');
        expect(CodeComplexityConfig.formatMaintainabilityStatus(90)).toBe('success');
    });

    it('should format Halstead reports correctly', () => {
        const halsteadMetrics = {
            bugs: 0.1,
            difficulty: 10,
            effort: 100,
            length: 50,
            time: 5,
            volume: 200,
        };
        const application = { _id: 1, repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'src/index.ts';
        const analyzedBranch = 'main';

        const result = CodeComplexityConfig.formatHalsteadReports({
            cyclomaticMetric: 0,
            fileMaintainability: 0,
            fileSLOC: { physical: 0, logical: 0 },
            summary: {} as CodeComplexityReportSummaryType,
            halsteadMetrics,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(result).toHaveLength(6);
    });

    it('should format cyclomatic complexity report correctly', () => {
        const application = { _id: 1, repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'src/index.ts';
        const analyzedBranch = 'main';

        const result = CodeComplexityConfig.formatCyclomaticComplexityReport({
            fileMaintainability: 0,
            fileSLOC: { physical: 0, logical: 0 },
            halsteadMetrics: {} as HalsteadMetricType,
            summary: {} as CodeComplexityReportSummaryType,
            cyclomaticMetric: 15,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(result.status).toBe('warning');
    });

    it('should format maintainability index report correctly', () => {
        const application = { _id: 1, repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'src/index.ts';
        const analyzedBranch = 'main';

        const result = CodeComplexityConfig.formatMaintainabilityIndexReport({
            cyclomaticMetric: 0,
            fileSLOC: { physical: 0, logical: 0 },
            halsteadMetrics: {} as HalsteadMetricType,
            summary: {} as CodeComplexityReportSummaryType,
            fileMaintainability: 75,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(result.status).toBe('warning');
    });

    it('should format file SLOC indicators correctly', () => {
        const fileSLOC = { physical: 100, logical: 50 };
        const application = { _id: 1, repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'src/index.ts';
        const analyzedBranch = 'main';

        const result = CodeComplexityConfig.formatFileSLOCIndicators({
            cyclomaticMetric: 0,
            fileMaintainability: 0,
            halsteadMetrics: {} as HalsteadMetricType,
            summary: {} as CodeComplexityReportSummaryType,
            fileSLOC,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(result).toHaveLength(2);
    });

    it('should format code complexity summary correctly', () => {
        const summary = { average: { maintainability: 80 } };
        const application = { _id: 1, repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'src/index.ts';
        const analyzedBranch = 'main';

        const result = CodeComplexityConfig.formatCodeComplexitySummary({
            cyclomaticMetric: 0,
            fileMaintainability: 0,
            fileSLOC: { physical: 0, logical: 0 },
            halsteadMetrics: {} as HalsteadMetricType,
            summary,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(result.status).toBe('warning');
    });
});
