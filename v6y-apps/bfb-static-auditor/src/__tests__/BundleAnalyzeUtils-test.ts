/* eslint-disable */
import { AuditUtils, auditStatus } from '@v6y/core-logic';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BundleAnalyzeUtils from '../auditors/bundle-analyzer/BundleAnalyzeUtils.ts';

vi.mock('@v6y/core-logic', async () => {
    const actualModule = await vi.importActual('@v6y/core-logic');

    return {
        ...actualModule,
        default: actualModule,
        AuditUtils: {
            getFrontendDirectories: vi.fn(),
            getPackageManager: vi.fn(),
        },
    };
});

describe('BundleAnalyzeUtils', () => {
    const mockApplicationId = 1;
    const mockWorkspaceFolder = '/fake/workspace';
    const mockModulePath = '/fake/workspace/module1';

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('getScoreStatus returns correct status for thresholds', () => {
        expect(BundleAnalyzeUtils.getScoreStatus(100 * 1024)).toBe('success');
        expect(BundleAnalyzeUtils.getScoreStatus(300 * 1024)).toBe('info');
        expect(BundleAnalyzeUtils.getScoreStatus(800 * 1024)).toBe('warning');
        expect(BundleAnalyzeUtils.getScoreStatus(2 * 1024 * 1024)).toBe('error');
    });

    it('should return an empty array if applicationId or workspaceFolder is missing', async () => {
        const result1 = await BundleAnalyzeUtils.startBundleAnalyzeReports({
            applicationId: undefined,
            workspaceFolder: mockWorkspaceFolder,
        });
        expect(result1).toEqual([]);
        const result2 = await BundleAnalyzeUtils.startBundleAnalyzeReports({
            applicationId: mockApplicationId,
            workspaceFolder: undefined,
        });
        expect(result2).toEqual([]);
    });

    it('should return an empty array if no frontend modules are found', async () => {
        (AuditUtils.getFrontendDirectories as any).mockReturnValue([]);
        const result = await BundleAnalyzeUtils.startBundleAnalyzeReports({
            applicationId: mockApplicationId,
            workspaceFolder: mockWorkspaceFolder,
        });
        expect(result).toEqual([]);
    });

    it('should return an empty array if no package manager is found', async () => {
        (AuditUtils.getPackageManager as any).mockReturnValue(null);
        const result = await BundleAnalyzeUtils.startBundleAnalyzeReports({
            applicationId: mockApplicationId,
            workspaceFolder: mockWorkspaceFolder,
        });
        expect(result).toEqual([]);
    });

    it('should return an error formated report if analyzeResult is errored', () => {
        const mockBundleAnalyse = {
            applicationId: mockApplicationId,
            workspaceFolder: mockWorkspaceFolder,
            modulePath: '/fake/workspace/module1',
            analyzeResult: {
                status: 'error' as 'error' | 'success',
                extraInfos: 'No bundler detected in the module.',
            },
        };

        const result = BundleAnalyzeUtils.formatBundleAnalyzeResult(mockBundleAnalyse);
        expect(result).toMatchObject({
            auditStatus: auditStatus.failure,
            extraInfos: 'No bundler detected in the module.',
        });
    });

    it('should return a success formated report if analyzeResult is success', () => {
        const mockBundleReport = {
            applicationId: mockApplicationId,
            workspaceFolder: mockWorkspaceFolder,
            modulePath: mockModulePath,
            analyzeResult: {
                status: 'success' as 'error' | 'success',
                report: {
                    gzipSize: 12345,
                },
            },
        };
        const result = BundleAnalyzeUtils.formatBundleAnalyzeResult(mockBundleReport);
        expect(result).toMatchObject({ auditStatus: auditStatus.success, score: 12345 });
        expect(result?.score).toEqual(12345);
    });

    it('should return null if analyzeResult is null', () => {
        const result = BundleAnalyzeUtils.formatBundleAnalyzeResult({
            applicationId: mockApplicationId,
            workspaceFolder: mockWorkspaceFolder,
            modulePath: mockModulePath,
            analyzeResult: null,
        });
        expect(result).toBeNull();
    });
});
