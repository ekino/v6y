import { describe, expect, it } from 'vitest';

import DoraMetricsUtils from './DoraMetricsUtils.js';
import mockCommits from './mockCommitsData.json' with { type: 'json' };
import mockDeployments from './mockDeploymentsData.json' with { type: 'json' };

const mockApplication = { _id: 1, name: 'TestApp' };

describe('DoraMetricsUtils', () => {
    it('should compute and format Dora metrics report correctly', () => {
        const result = DoraMetricsUtils.analyseDoraMetrics({
            deployments: mockDeployments,
            commits: mockCommits,
            application: mockApplication,
        });

        expect(result).not.toBeNull();
        const expectedResults = [
            {
                type: 'DORA_Metrics',
                category: 'deployment_frequency',
                status: 'success',
                extraInfos: 'Number of deployments per day.',
                module: {
                    appId: 1,
                },
                score: 0.5352103228528413,
                scoreUnit: 'deployments/day',
            },
            {
                type: 'DORA_Metrics',
                category: 'lead_time_for_changes',
                status: 'success',
                extraInfos: 'Time between commit and deployment.',
                module: {
                    appId: 1,
                },
                score: 14.950542530864194,
                scoreUnit: 'hours',
            },
            {
                extraInfos: 'Percentage of failed deployments.',
                category: 'change_failure_rate',
                module: {
                    appId: 1,
                },
                score: 0,
                scoreUnit: 'percentage',
                status: 'failure',
                type: 'DORA_Metrics',
            },
            {
                type: 'DORA_Metrics',
                category: 'mean_time_to_restore_service',
                status: 'failure',
                extraInfos: 'Time to restore service after a failure.',
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
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(0.5423728813559322, 0.5);
    });

    it('should compute lead time for changes correctly', () => {
        const result = DoraMetricsUtils.calculateLeadTimeForChanges({
            deployments: mockDeployments,
            commits: mockCommits,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(14.950542530864197, 1);
    });

    it('should compute change failure rate correctly', () => {
        const result = DoraMetricsUtils.calculateChangeFailureRate();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.status).toEqual('failure'); // Function not implemented yet
        expect(result.value).toEqual(0); // Function not implemented yet
    });

    it('should compute mean time to restore service correctly', () => {
        const result = DoraMetricsUtils.calculateMeanTimeToRestoreService();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');

        expect(result.status).toEqual('failure'); // Function not implemented yet
        expect(result.value).toEqual(0); // Function not implemented yet
    });
});
