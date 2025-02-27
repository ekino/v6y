import { auditStatus } from '@v6y/core-logic';
import { devOpsCategories, devOpsType } from '@v6y/core-logic/src/config/DevOpsConfig.ts';
import { describe, expect, it } from 'vitest';

import DoraMetricsUtils from '../auditors/dora-metrics/DoraMetricsUtils.ts';
import mockDeployments from '../auditors/dora-metrics/mockDeploymentsData.json' with { type: 'json' };
import mockMergeRequests from '../auditors/dora-metrics/mockMergeRequestsData.json' with { type: 'json' };

const mockApplication = { _id: 1, name: 'TestApp' };
const mockDateRange = { dateStart: '2025-02-01', dateEnd: '2025-02-10' };

describe('DoraMetricsUtils', () => {
    it('should compute and format Dora metrics report correctly', () => {
        const result = DoraMetricsUtils.analyseDoraMetrics({
            deployments: mockDeployments,
            mergeRequests: mockMergeRequests,
            application: mockApplication,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        const expectedResults = [
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.DEPLOYMENT_FREQUENCY,
                status: auditStatus.info,
                module: {
                    appId: 1,
                },
                score: 0.3333333333333333,
                scoreUnit: 'deployments/day',
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.LEAD_REVIEW_TIME,
                status: auditStatus.info,
                module: {
                    appId: 1,
                },
                score: 1.4602633333333332,
                scoreUnit: 'hours',
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.LEAD_TIME_FOR_CHANGES,
                score: 1.493859074074074,
                scoreUnit: 'hours',
                status: auditStatus.info,
                module: {
                    appId: 1,
                },
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.CHANGE_FAILURE_RATE,
                module: {
                    appId: 1,
                },
                score: -1,
                scoreUnit: 'percentage',
                status: auditStatus.error,
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.MEAN_TIME_TO_RESTORE_SERVICE,
                status: auditStatus.error,
                score: -1,
                scoreUnit: 'hours',
                module: {
                    appId: 1,
                },
            },
        ];
        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(Array);
        expect(result).toEqual(expectedResults);
    });

    it('should compute deployment frequency correctly', () => {
        const result = DoraMetricsUtils.calculateDeploymentFrequency({
            deployments: mockDeployments,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(0.3333333333333333, 0.5);
    });

    it('should compute lead review time correctly', () => {
        const result = DoraMetricsUtils.calculateLeadReviewTime({
            mergeRequests: mockMergeRequests,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(1.4602633333333332, 1);
    });

    it('should compute lead time for changes correctly', () => {
        const result = DoraMetricsUtils.calculateLeadTimeForChanges({
            leadReviewTime: 1.4602633333333332,
            deployments: mockDeployments,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(1.493859074074074, 1);
    });

    it('should compute change failure rate correctly', () => {
        const result = DoraMetricsUtils.calculateChangeFailureRate();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.status).toEqual('error'); // Function not implemented yet
        expect(result.value).toEqual(-1); // Function not implemented yet
    });

    it('should compute mean time to restore service correctly', () => {
        const result = DoraMetricsUtils.calculateMeanTimeToRestoreService();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');

        expect(result.status).toEqual('error'); // Function not implemented yet
        expect(result.value).toEqual(-1); // Function not implemented yet
    });
});
