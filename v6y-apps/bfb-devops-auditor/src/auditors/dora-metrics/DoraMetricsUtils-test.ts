import { describe, expect, it } from 'vitest';

import DoraMetricsUtils from './DoraMetricsUtils.ts';
import mockDeployments from './mockDeploymentsData.json' with { type: 'json' };
import mockMergeRequests from './mockMergeRequestsData.json' with { type: 'json' };

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
                type: 'DORA_Metrics',
                category: 'deployment_frequency',
                status: 'info',
                extraInfos:
                    'Number of deployments per day. Date range: ' +
                    mockDateRange.dateStart +
                    ' - ' +
                    mockDateRange.dateEnd,
                module: {
                    appId: 1,
                },
                score: 0.3333333333333333,
                scoreUnit: 'deployments/day',
            },
            {
                type: 'DORA_Metrics',
                category: 'lead_review_time',
                status: 'info',
                extraInfos:
                    'Time between the opening and the merge of a MR. Date range: ' +
                    mockDateRange.dateStart +
                    ' - ' +
                    mockDateRange.dateEnd,
                module: {
                    appId: 1,
                },
                score: 1.4602633333333332,
                scoreUnit: 'hours',
            },
            {
                category: 'lead_time_for_changes',
                extraInfos:
                    'Time between the creation of a change and the deployment. Date range: ' +
                    mockDateRange.dateStart +
                    ' - ' +
                    mockDateRange.dateEnd,
                module: {
                    appId: 1,
                },
                score: 1.493859074074074,
                scoreUnit: 'hours',
                status: 'info',
                type: 'DORA_Metrics',
            },
            {
                extraInfos:
                    'Percentage of failed deployments. Date range: ' +
                    mockDateRange.dateStart +
                    ' - ' +
                    mockDateRange.dateEnd,
                category: 'change_failure_rate',
                module: {
                    appId: 1,
                },
                score: 0,
                scoreUnit: 'percentage',
                status: 'error',
                type: 'DORA_Metrics',
            },
            {
                type: 'DORA_Metrics',
                category: 'mean_time_to_restore_service',
                status: 'error',
                extraInfos:
                    'Time to restore service after a failure. Date range: ' +
                    mockDateRange.dateStart +
                    ' - ' +
                    mockDateRange.dateEnd,
                module: {
                    appId: 1,
                },
                score: 0,
                scoreUnit: 'hours',
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
        expect(result.value).toEqual(0); // Function not implemented yet
    });

    it('should compute mean time to restore service correctly', () => {
        const result = DoraMetricsUtils.calculateMeanTimeToRestoreService();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');

        expect(result.status).toEqual('error'); // Function not implemented yet
        expect(result.value).toEqual(0); // Function not implemented yet
    });
});
