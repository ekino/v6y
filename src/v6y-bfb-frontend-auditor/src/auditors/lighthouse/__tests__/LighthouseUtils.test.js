import { AppLogger } from '@v6y/commons';

import LighthouseUtils from '../LighthouseUtils.js';

jest.mock('@v6y/commons');

describe('LighthouseUtils', () => {
    beforeEach(() => {
        AppLogger.info.mockClear();
    });

    it('should return true for failed audit status', () => {
        expect(LighthouseUtils.isAuditFailed('warning')).toBe(true);
        expect(LighthouseUtils.isAuditFailed('error')).toBe(true);
        expect(LighthouseUtils.isAuditFailed('success')).toBe(false);
    });

    it('should return true for performance failed audit report', () => {
        const report = { category: 'performance', status: 'error' };
        expect(LighthouseUtils.isAuditPerformanceFailed(report)).toBe(true);
    });

    it('should return true for accessibility failed audit report', () => {
        const report = { category: 'accessibility', status: 'warning' };
        expect(LighthouseUtils.isAuditAccessibilityFailed(report)).toBe(true);
    });

    it('should format audit category correctly', () => {
        const auditCategory = {
            id: 'performance',
            title: 'Performance',
            score: 0.8,
            description: 'Performance metrics',
        };
        const formattedCategory = LighthouseUtils.formatAuditCategory(auditCategory);
        expect(formattedCategory).toEqual({
            category: 'performance',
            title: 'Performance',
            description: 'Performance metrics',
            status: 'success',
            score: 80,
            scoreUnit: '%',
            branch: null,
        });
    });

    it('should format audit metric correctly', () => {
        const auditMetric = {
            id: 'largest-contentful-paint',
            title: 'LCP',
            description: 'Largest Contentful Paint',
            numericValue: 2500,
            numericUnit: 'ms',
        };
        const formattedMetric = LighthouseUtils.formatAuditMetric(auditMetric);
        expect(formattedMetric).toEqual({
            category: 'largest-contentful-paint',
            title: 'LCP',
            status: 'warning',
            description: 'Largest Contentful Paint',
            score: '2.50',
            scoreUnit: 's',
            branch: null,
        });
    });

    it('should parse Lighthouse audit report correctly', () => {
        const auditReportData = JSON.stringify({
            categories: {
                performance: {
                    id: 'performance',
                    title: 'Performance',
                    score: 0.8,
                    description: 'Performance metrics',
                },
                accessibility: {
                    id: 'accessibility',
                    title: 'Accessibility',
                    score: 0.6,
                    description: 'Accessibility metrics',
                },
            },
            audits: {
                'largest-contentful-paint': {
                    id: 'largest-contentful-paint',
                    title: 'LCP',
                    description: 'Largest Contentful Paint',
                    numericValue: 2500,
                    numericUnit: 'ms',
                },
            },
        });
        const parsedReport = LighthouseUtils.parseLighthouseAuditReport(auditReportData);
        expect(parsedReport).toEqual([
            {
                category: 'performance',
                title: 'Performance',
                description: 'Performance metrics',
                status: 'success',
                score: 80,
                scoreUnit: '%',
                branch: null,
            },
            {
                category: 'accessibility',
                title: 'Accessibility',
                description: 'Accessibility metrics',
                status: 'warning',
                score: 60,
                scoreUnit: '%',
                branch: null,
            },
            {
                category: 'largest-contentful-paint',
                title: 'LCP',
                status: 'warning',
                description: 'Largest Contentful Paint',
                score: '2.50',
                scoreUnit: 's',
                branch: null,
            },
        ]);
    });

    it('should format Lighthouse reports correctly', () => {
        const reports = [
            {
                appLink: 'http://example.com',
                data: JSON.stringify({
                    categories: {
                        performance: {
                            id: 'performance',
                            title: 'Performance',
                            score: 0.8,
                            description: 'Performance metrics',
                        },
                        accessibility: {
                            id: 'accessibility',
                            title: 'Accessibility',
                            score: 0.6,
                            description: 'Accessibility metrics',
                        },
                    },
                    audits: {
                        'largest-contentful-paint': {
                            id: 'largest-contentful-paint',
                            title: 'LCP',
                            description: 'Largest Contentful Paint',
                            numericValue: 2500,
                            numericUnit: 'ms',
                        },
                    },
                }),
                subCategory: 'subCategory1',
            },
        ];
        const application = { _id: 'app1', repo: { webUrl: 'http://example.com' } };
        const formattedReports = LighthouseUtils.formatLighthouseReports({
            reports,
            application,
        });

        expect(formattedReports).toEqual([
            {
                type: 'Lighthouse',
                category: 'performance',
                subCategory: 'subCategory1',
                status: 'success',
                score: 80,
                scoreUnit: '%',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'path',
                    path: 'http://example.com',
                },
            },
            {
                type: 'Lighthouse',
                category: 'accessibility',
                subCategory: 'subCategory1',
                status: 'warning',
                score: 60,
                scoreUnit: '%',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'path',
                    path: 'http://example.com',
                },
            },
            {
                type: 'Lighthouse',
                category: 'largest-contentful-paint',
                subCategory: 'subCategory1',
                status: 'warning',
                score: '2.50',
                scoreUnit: 's',
                module: {
                    appId: 'app1',
                    url: 'http://example.com',
                    branch: 'path',
                    path: 'http://example.com',
                },
            },
        ]);
    });
});
