import { describe, expect, it } from 'vitest';

import { auditStatus, scoreStatus } from '@v6y/core-logic';
import { DateUtils } from '@v6y/core-logic';
import { devOpsCategories, devOpsType } from '@v6y/core-logic/src/config/DevOpsConfig.ts';

import DoraMetricsUtils from '../auditors/dora-metrics/DoraMetricsUtils.ts';
import mockDeployments from '../auditors/dora-metrics/mockDeploymentsData.json' with { type: 'json' };
import mockMergeRequests from '../auditors/dora-metrics/mockMergeRequestsData.json' with { type: 'json' };

const mockMonitoringEvents = [
    {
        id: 'AwAAAZU9SDv4Jr7GUwAAABhBWlU5U0QzU0FBRGozNVdZcDdkcGdBUXYAAAAkMDE5NTNkNjYtZTNhMC00NGQ2LWE5ZWMtNTg1MDVjMmQ3MGYzAAAAAQ',
        status: 'error',
        timestamp: 1740489899000,
        type: 'event',
    },
    {
        id: 'AwAAAZU9ZuOgKgrGUwAAABhBWlU5WnVZMEFBQ1o2N2RFMnN1WldyUzIAAAAkMDE5NTNkNjYtZTNhMC00NGQ2LWE5ZWMtNTg1MDVjMmQ3MGYzAAAAAg',
        status: 'success',
        timestamp: 1740491908000,
        type: 'event',
    },
    {
        id: 'AwAAAZVBkB7YdVxDLAAAABhBWlZCa0NGUUFBQXIyb3I1SlpMc2IyLXoAAAAkMDE5NTQxOTAtMWVkOC00YWVhLTgyMzctODhmYzEyNWNmYTA2AAAAAA',
        status: 'error',
        timestamp: 1740561719000,
        type: 'event',
    },
];

const mockApplication = { _id: 1, name: 'TestApp' };
const mockDateRange = {
    dateStart: DateUtils.formatStringToDate('2025-02-01'),
    dateEnd: DateUtils.formatStringToDate('2025-03-03'),
};

describe('DoraMetricsUtils', () => {
    it('should compute and format Dora metrics report correctly', () => {
        const result = DoraMetricsUtils.analyseDoraMetrics({
            deployments: mockDeployments,
            mergeRequests: mockMergeRequests,
            monitoringEvents: mockMonitoringEvents,
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
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.warning,
                module: {
                    appId: 1,
                },
                score: 0.1,
                scoreUnit: 'deployments/day',
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.LEAD_REVIEW_TIME,
                scoreStatus: scoreStatus.info,
                auditStatus: auditStatus.success,
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
                scoreStatus: scoreStatus.info,
                auditStatus: auditStatus.success,
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
                score: null,
                scoreUnit: '%',
                scoreStatus: null,
                auditStatus: auditStatus.failure,
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.MEAN_TIME_TO_RESTORE_SERVICE,
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.warning,
                score: 55.59583333333333,
                scoreUnit: 'hours',
                module: {
                    appId: 1,
                },
            },
            {
                dateStart: new Date(mockDateRange.dateStart),
                dateEnd: new Date(mockDateRange.dateEnd),
                type: devOpsType.DORA,
                category: devOpsCategories.UP_TIME_AVERAGE,
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.warning,
                score: 84.55671296296296,
                scoreUnit: '%',
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
        expect(result).toHaveProperty('auditStatus');
        expect(result).toHaveProperty('valueStatus');
        expect(result).toHaveProperty('value');
        expect(result.auditStatus).toEqual(auditStatus.success);
        expect(result.valueStatus).toEqual(scoreStatus.warning);
        expect(result.value).toEqual(0.1);
    });

    it('should compute lead review time correctly', () => {
        const result = DoraMetricsUtils.calculateLeadReviewTime({
            mergeRequests: mockMergeRequests,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('auditStatus');
        expect(result).toHaveProperty('valueStatus');
        expect(result).toHaveProperty('value');
        expect(result.auditStatus).toEqual(auditStatus.success);
        expect(result.valueStatus).toEqual(scoreStatus.info);
        expect(result.value).toBeCloseTo(1.4602633333333332, 1);
    });

    it('should compute lead time for changes correctly', () => {
        const result = DoraMetricsUtils.calculateLeadTimeForChanges({
            leadReviewTime: 1.4602633333333332,
            deployments: mockDeployments,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('auditStatus');
        expect(result).toHaveProperty('valueStatus');
        expect(result).toHaveProperty('value');
        expect(result.auditStatus).toEqual(auditStatus.success);
        expect(result.valueStatus).toEqual(scoreStatus.info);
        expect(result.value).toBeCloseTo(1.493859074074074, 1);
    });

    it('should compute change failure rate correctly', () => {
        const result = DoraMetricsUtils.calculateChangeFailureRate();

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('auditStatus');
        expect(result).toHaveProperty('valueStatus');
        expect(result).toHaveProperty('value');
        expect(result.auditStatus).toEqual(auditStatus.failure);
        expect(result.valueStatus).toBeNull(); // Function not implemented yet
        expect(result.value).toBeNull(); // Function not implemented yet
    });

    it('should compute mean time to restore service correctly', () => {
        const downtimePeriods = DoraMetricsUtils.calculateDownTimePeriods({
            monitoringEvents: mockMonitoringEvents,
            dateStart: mockDateRange.dateStart,
            dateEnd: mockDateRange.dateEnd,
        });
        const result = DoraMetricsUtils.calculateMeanTimeToRestoreService({ downtimePeriods });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('auditStatus');
        expect(result).toHaveProperty('valueStatus');
        expect(result).toHaveProperty('value');
        expect(result.auditStatus).toEqual(auditStatus.success);
        expect(result.valueStatus).toEqual(scoreStatus.warning);
        expect(result.value).toEqual(55.59583333333333);
    });

    it('should compute uptime average correctly', () => {
        const downtimePeriods = DoraMetricsUtils.calculateDownTimePeriods({
            monitoringEvents: mockMonitoringEvents,
            dateStart: mockDateRange.dateStart,
            dateEnd: mockDateRange.dateEnd,
        });
        const result = DoraMetricsUtils.calculateUpTimeAverage({
            downtimePeriods,
            ...mockDateRange,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('auditStatus');
        expect(result).toHaveProperty('valueStatus');
        expect(result).toHaveProperty('value');
        expect(result.auditStatus).toEqual(auditStatus.success);
        expect(result.valueStatus).toEqual(scoreStatus.warning);
        expect(result.value).toEqual(84.55671296296296);
    });
});
