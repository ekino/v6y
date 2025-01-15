import { describe, expect, it } from 'vitest';

import DoraMetricsUtils from './DoraMetricsUtils.js';
// importer le fichier mockDeploymentsData.json
// importer le fichier mockCommitsData.json

// eslint-disable-next-line prettier/prettier
import mockDeployments from './mockDeploymentsData.json' assert { type: "json" };

import mockCommits from './mockCommitsData.json' assert { type: "json" };


const mockApplication = { _id: 1, name: 'TestApp' };

describe('DoraMetricsUtils', () => {
    it('should compute Dora metrics report correctly', () => {
        const result = DoraMetricsUtils.computeDoraMetricsReport({
            deployments: mockDeployments,
            commits: mockCommits,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('deploymentFrequency');
        expect(result).toHaveProperty('leadTimeForChanges');
        expect(result).toHaveProperty('changeFailureRate');
        expect(result).toHaveProperty('meanTimeToRestoreService');
    });

    it('should compute deployment frequency correctly', () => {
        const result = DoraMetricsUtils.computeDeploymentFrequency({
            deployments: mockDeployments,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(0.5423728813559322, 0.5);
    });

    it('should compute lead time for changes correctly', () => {
        const result = DoraMetricsUtils.computeLeadTimeForChanges({
            deployments: mockDeployments,
            commits: mockCommits,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.value).toBeCloseTo(14.950542530864197, 1);
    });

    it('should compute change failure rate correctly', () => {
        const result = DoraMetricsUtils.computeChangeFailureRate();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');
        expect(result.status).toEqual('failure'); // Function not implemented yet
        expect(result.value).toEqual(0); // Function not implemented yet
    });

    it('should compute mean time to restore service correctly', () => {
        const result = DoraMetricsUtils.computeMeanTimeToRestoreService();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('value');

        expect(result.status).toEqual('failure'); // Function not implemented yet
        expect(result.value).toEqual(0); // Function not implemented yet
    });

    it('should format Dora metrics reports correctly', () => {
        const result = DoraMetricsUtils.formatDoraMetricsReports({
            report: {
                deploymentFrequency: { status: 'success', value: 1 },
                leadTimeForChanges: { status: 'success', value: 1 },
                changeFailureRate: { status: 'success', value: 1 },
                meanTimeToRestoreService: { status: 'success', value: 1 },
            },
            application: mockApplication,
        });

        const expectedResults = [
            {
                type: 'DORA_Metrics',
                category: 'deployment_frequency',
                status: 'success',
                extraInfos: 'Number of deployments per day.',
                module: {
                    appId: 1,
                },
                score: 1,
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
                score: 1,
                scoreUnit: 'hours',
            },
            {
                extraInfos: 'Percentage of failed deployments.',
                category: 'change_failure_rate',
                module: {
                    appId: 1,
                },
                score: 1,
                scoreUnit: 'percentage',
                status: 'success',
                type: 'DORA_Metrics',
            },
            {
                type: 'DORA_Metrics',
                category: 'mean_time_to_restore_service',
                status: 'success',
                extraInfos: 'Time to restore service after a failure.',
                module: {
                    appId: 1,
                },
                score: 1,
                scoreUnit: 'hours',
            },
        ];
        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(Array);
        expect(result).toEqual(expectedResults);
    });
});
