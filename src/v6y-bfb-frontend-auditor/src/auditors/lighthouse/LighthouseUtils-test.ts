/* eslint-disable */
import { AuditType, auditStatus } from '@v6y/commons';
import { describe, expect, it } from 'vitest';

import {
    LighthouseAuditCategoryType,
    LighthouseAuditMetricType,
} from '../types/LighthouseAuditType.ts';
import LighthouseUtils from './LighthouseUtils.ts';

describe('LighthouseUtils', () => {
    it('should return true for "warning" or "error" status', () => {
        expect(LighthouseUtils.isAuditFailed(auditStatus.warning)).toBe(true);
        expect(LighthouseUtils.isAuditFailed(auditStatus.error)).toBe(true);
    });

    it('should return false for other statuses', () => {
        expect(LighthouseUtils.isAuditFailed(auditStatus.success)).toBe(false);
        expect(LighthouseUtils.isAuditFailed(auditStatus.info)).toBe(false);
        expect(LighthouseUtils.isAuditFailed(undefined)).toBe(false);
    });

    it('should return true for failed performance audits', () => {
        const report: AuditType = {
            category: 'performance',
            status: auditStatus.error,
        } as AuditType;
        expect(LighthouseUtils.isAuditPerformanceFailed(report)).toBe(true);

        report.status = auditStatus.warning;
        expect(LighthouseUtils.isAuditPerformanceFailed(report)).toBe(true);
    });

    it('should return false for non-performance or successful audits', () => {
        const report1: AuditType = {
            category: 'accessibility',
            status: auditStatus.error,
        } as AuditType;
        expect(LighthouseUtils.isAuditPerformanceFailed(report1)).toBe(false);

        const report2: AuditType = {
            category: 'performance',
            status: auditStatus.success,
        } as AuditType;
        expect(LighthouseUtils.isAuditPerformanceFailed(report2)).toBe(false);
    });

    it('should return true for failed accessibility audits', () => {
        const report: AuditType = {
            category: 'accessibility',
            status: auditStatus.error,
        } as AuditType;
        expect(LighthouseUtils.isAuditAccessibilityFailed(report)).toBe(true);

        report.status = auditStatus.warning;
        expect(LighthouseUtils.isAuditAccessibilityFailed(report)).toBe(true);
    });

    it('should return false for non-accessibility or successful audits', () => {
        const report1: AuditType = {
            category: 'performance',
            status: auditStatus.error,
        } as AuditType;
        expect(LighthouseUtils.isAuditAccessibilityFailed(report1)).toBe(false);

        const report2: AuditType = {
            category: 'accessibility',
            status: auditStatus.success,
        } as AuditType;
        expect(LighthouseUtils.isAuditAccessibilityFailed(report2)).toBe(false);
    });

    it('should return null for null input', () => {
        expect(LighthouseUtils.formatAuditCategory()).toBeNull();
    });

    it('should format audit category correctly', () => {
        const auditCategory: LighthouseAuditCategoryType = {
            id: 'performance',
            title: 'Performance',
            score: 0.9,
            description: 'Measures how well the page performs.',
        };

        const result = LighthouseUtils.formatAuditCategory(auditCategory);

        expect(result).toEqual({
            category: 'performance',
            title: 'Performance',
            description: 'Measures how well the page performs.',
            status: auditStatus.success, // 0.9 * 100 = 90, which is > 70
            score: 90,
            scoreUnit: '%',
            branch: undefined,
        });
    });

    it('should return null for null input', () => {
        expect(LighthouseUtils.formatAuditMetric()).toBeNull();
    });

    it('should format audit metric correctly for largest-contentful-paint', () => {
        const auditMetric: LighthouseAuditMetricType = {
            id: 'largest-contentful-paint',
            title: 'Largest Contentful Paint',
            description: 'Measures loading performance.',
            numericValue: 3000, // 3 seconds
            numericUnit: 'millisecond',
        };

        const result = LighthouseUtils.formatAuditMetric(auditMetric);

        expect(result).toEqual({
            category: 'largest-contentful-paint',
            title: 'Largest Contentful Paint',
            description: 'Measures loading performance.',
            status: auditStatus.warning, // 3s is between 2.5s and 4s
            score: 3.0,
            scoreUnit: 's',
            branch: undefined,
        });
    });

    it('should return null for null or empty input', () => {
        expect(LighthouseUtils.parseLighthouseAuditReport()).toBeNull();
        expect(LighthouseUtils.parseLighthouseAuditReport([])).toBeNull();
        expect(LighthouseUtils.parseLighthouseAuditReport('')).toBeNull();
    });

    it('should return null for ERRORED_DOCUMENT_REQUEST', () => {
        const auditReportData = JSON.stringify({
            runtimeError: { code: 'ERRORED_DOCUMENT_REQUEST' },
        });

        const result = LighthouseUtils.parseLighthouseAuditReport(auditReportData);

        expect(result).toBeNull();
    });

    it('should parse and format lighthouse audit report correctly', () => {
        const auditReportData = JSON.stringify({
            categories: {
                performance: {
                    id: 'performance',
                    title: 'Performance',
                    score: 0.85,
                },
                accessibility: {
                    id: 'accessibility',
                    title: 'Accessibility',
                    score: 0.95,
                },
            },
            audits: {
                'first-contentful-paint': {
                    id: 'first-contentful-paint',
                    title: 'First Contentful Paint',
                    description: 'Measures loading experience.',
                    numericValue: 1500, // 1.5 seconds
                    numericUnit: 'millisecond',
                },
                // ... other audit metrics
            },
        });

        const result = LighthouseUtils.parseLighthouseAuditReport(auditReportData);

        expect(result).toEqual([
            {
                category: 'performance',
                title: 'Performance',
                description: undefined, // Assuming description is not present in the mock data
                status: auditStatus.success, // 0.85 * 100 = 85, which is > 70
                score: 85,
                scoreUnit: '%',
                branch: undefined,
            },
            {
                category: 'accessibility',
                title: 'Accessibility',
                description: undefined,
                status: auditStatus.success, // 0.95 * 100 = 95, which is > 70
                score: 95,
                scoreUnit: '%',
                branch: undefined,
            },
            {
                category: 'first-contentful-paint',
                title: 'First Contentful Paint',
                description: 'Measures loading experience.',
                status: auditStatus.success, // 1.5s is < 1.8s
                score: 1.5,
                scoreUnit: 's',
                branch: undefined,
            },
        ]);
    });

    it('should format audit metric correctly for first-contentful-paint', () => {
        const auditMetric: LighthouseAuditMetricType = {
            id: 'first-contentful-paint',
            title: 'First Contentful Paint',
            description: 'Measures loading experience.',
            numericValue: 2000, // 2 seconds
            numericUnit: 'millisecond',
        };

        const result = LighthouseUtils.formatAuditMetric(auditMetric);

        expect(result).toEqual({
            category: 'first-contentful-paint',
            title: 'First Contentful Paint',
            description: 'Measures loading experience.',
            status: auditStatus.warning, // 2s is between 1.8s and 3s
            score: 2.0,
            scoreUnit: 's',
            branch: undefined,
        });
    });

    it('should format audit metric correctly for total-blocking-time', () => {
        const auditMetric: LighthouseAuditMetricType = {
            id: 'total-blocking-time',
            title: 'Total Blocking Time',
            description: 'Measures total blocking time.',
            numericValue: 500, // 0.5 seconds
            numericUnit: 'millisecond',
        };

        const result = LighthouseUtils.formatAuditMetric(auditMetric);

        expect(result).toEqual({
            category: 'total-blocking-time',
            title: 'Total Blocking Time',
            description: 'Measures total blocking time.',
            status: auditStatus.warning, // 0.5s is between 0.2s and 0.6s
            score: 0.5,
            scoreUnit: 's',
            branch: undefined,
        });
    });

    it('should format audit metric correctly for speed-index', () => {
        const auditMetric: LighthouseAuditMetricType = {
            id: 'speed-index',
            title: 'Speed Index',
            description: 'Measures speed index.',
            numericValue: 4000, // 4 seconds
            numericUnit: 'millisecond',
        };

        const result = LighthouseUtils.formatAuditMetric(auditMetric);

        expect(result).toEqual({
            category: 'speed-index',
            title: 'Speed Index',
            description: 'Measures speed index.',
            status: auditStatus.warning, // 4s is between 3.4s and 5.8s
            score: 4.0,
            scoreUnit: 's',
            branch: undefined,
        });
    });

    it('should format audit metric correctly for cumulative-layout-shift', () => {
        const auditMetric: LighthouseAuditMetricType = {
            id: 'cumulative-layout-shift',
            title: 'Cumulative Layout Shift',
            description: 'Measures layout shift.',
            numericValue: 0.15, // 0.15
            numericUnit: 'unitless',
        };

        const result = LighthouseUtils.formatAuditMetric(auditMetric);

        expect(result).toEqual({
            category: 'cumulative-layout-shift',
            title: 'Cumulative Layout Shift',
            description: 'Measures layout shift.',
            status: auditStatus.warning, // 0.15 is between 0.1 and 0.25
            score: 0.15,
            scoreUnit: '',
            branch: undefined,
        });
    });
});
