import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';

import CodeComplexityConfig from '../CodeComplexityConfig.js';

describe('CodeComplexityConfig', () => {
    it('should format maintainability status correctly', () => {
        expect(CodeComplexityConfig.formatMaintainabilityStatus(60)).toBe(auditStatus.error);
        expect(CodeComplexityConfig.formatMaintainabilityStatus(85)).toBe(auditStatus.success);
        expect(CodeComplexityConfig.formatMaintainabilityStatus(75)).toBe(auditStatus.warning);
        expect(CodeComplexityConfig.formatMaintainabilityStatus(null)).toBe(auditStatus.error);
    });

    it('should format Halstead reports correctly', () => {
        const halsteadMetrics = {
            bugs: 0.1,
            difficulty: 10,
            effort: 100,
            length: 200,
            time: 50,
            volume: 300,
        };
        const application = { _id: 'app1', repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'file.js';
        const analyzedBranch = 'main';

        const reports = CodeComplexityConfig.formatHalsteadReports({
            halsteadMetrics,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(reports).toEqual([
            {
                type: 'Code-Complexity',
                category: 'halstead-program-length',
                subCategory: null,
                status: auditStatus.info,
                score: 200,
                scoreUnit: '',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
            {
                type: 'Code-Complexity',
                category: 'halstead-program-volume',
                status: auditStatus.info,
                score: 300,
                scoreUnit: 'bit',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
            {
                type: 'Code-Complexity',
                category: 'halstead-program-difficulty',
                status: auditStatus.info,
                score: 10,
                scoreUnit: '',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
            {
                type: 'Code-Complexity',
                category: 'halstead-program-effort',
                status: auditStatus.info,
                score: 100,
                scoreUnit: 'bit',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
            {
                type: 'Code-Complexity',
                category: 'halstead-program-estimated-bugs',
                status: auditStatus.info,
                score: 0.1,
                scoreUnit: '',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
            {
                type: 'Code-Complexity',
                category: 'halstead-program-time-to-implement',
                status: auditStatus.info,
                score: 50,
                scoreUnit: 's',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
        ]);
    });

    it('should format cyclomatic complexity report correctly', () => {
        const application = { _id: 'app1', repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'file.js';
        const analyzedBranch = 'main';

        const report = CodeComplexityConfig.formatCyclomaticComplexityReport({
            cyclomaticMetric: 15,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(report).toEqual({
            type: 'Code-Complexity',
            category: 'cyclomatic-complexity',
            status: auditStatus.warning,
            score: 15,
            scoreUnit: '',
            module: {
                appId: 'app1',
                url: 'http://example.com',
                branch: 'main',
                path: 'file.js',
            },
        });
    });

    it('should format maintainability index report correctly', () => {
        const application = { _id: 'app1', repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'file.js';
        const analyzedBranch = 'main';

        const report = CodeComplexityConfig.formatMaintainabilityIndexReport({
            fileMaintainability: 90,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(report).toEqual({
            type: 'Code-Complexity',
            category: 'maintainability-index',
            status: auditStatus.success,
            score: 90,
            scoreUnit: '%',
            module: {
                appId: 'app1',
                url: 'http://example.com',
                branch: 'main',
                path: 'file.js',
            },
        });
    });

    it('should format file SLOC indicators correctly', () => {
        const fileSLOC = { physical: 100, logical: 80 };
        const application = { _id: 'app1', repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'file.js';
        const analyzedBranch = 'main';

        const indicators = CodeComplexityConfig.formatFileSLOCIndicators({
            fileSLOC,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(indicators).toEqual([
            {
                type: 'Code-Complexity',
                category: 'physical-sloc',
                status: auditStatus.info,
                score: 100,
                scoreUnit: '',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
            {
                type: 'Code-Complexity',
                category: 'logical-sloc',
                status: auditStatus.info,
                score: 80,
                scoreUnit: '',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'main',
                    path: 'file.js',
                },
            },
        ]);
    });

    it('should format code complexity summary correctly', () => {
        const summary = { average: { maintainability: 75 } };
        const application = { _id: 'app1', repo: { webUrl: 'http://example.com' } };
        const analyzedFile = 'file.js';
        const analyzedBranch = 'main';

        const report = CodeComplexityConfig.formatCodeComplexitySummary({
            summary,
            application,
            analyzedFile,
            analyzedBranch,
        });

        expect(report).toEqual({
            type: 'Code-Complexity',
            category: 'maintainability-index-project-average',
            status: auditStatus.warning,
            score: 75,
            scoreUnit: '%',
            module: {
                appId: 'app1',
                url: 'http://example.com',
                branch: 'main',
                path: 'file.js',
            },
        });
    });
});
