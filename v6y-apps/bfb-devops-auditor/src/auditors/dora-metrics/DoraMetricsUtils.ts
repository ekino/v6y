import { AppLogger, AuditType } from '@v6y/core-logic';

import {
    DoraMetricType,
    DoraMetricsAuditParamsType,
    DoraMetricsData,
} from '../types/DoraMetricsAuditType.ts';

const MSTOHOURS = 1000 * 60 * 60;

const timePeriodCalulation = (deploymentTimes: Date[]): number => {
    return (
        (deploymentTimes[deploymentTimes.length - 1].getTime() - deploymentTimes[0].getTime()) /
        (MSTOHOURS * 24)
    );
};

const frequencyCalculation = (deploymentTimes: Date[], timePeriod: number): number => {
    return timePeriod > 0 ? deploymentTimes.length / timePeriod : deploymentTimes.length;
};

/**
 * Compute the deployment frequency.
 * @param deployments
 */
const calculateDeploymentFrequency = ({ deployments }: DoraMetricsData): DoraMetricType => {
    AppLogger.info(`[DoraMetricsUtils - calculateDeploymentFrequency] start`);
    if (!deployments || deployments.length === 0) {
        AppLogger.info(`[DoraMetricsUtils - calculateDeploymentFrequency] deployments is empty`);
        return { status: 'failure', value: 0 };
    }

    const deploymentTimes = deployments
        .filter((d) => d.status === 'success')
        .map((d) => new Date(d.created_at))
        .sort((a, b) => a.getTime() - b.getTime());

    if (deploymentTimes.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateDeploymentFrequency] no successful deployments`,
        );
        return { status: 'failure', value: 0 };
    }

    const timePeriod = timePeriodCalulation(deploymentTimes);
    const frequency = frequencyCalculation(deploymentTimes, timePeriod);
    AppLogger.info(
        `[DoraMetricsUtils - calculateDeploymentFrequency] deployment frequency: ${frequency}`,
    );
    return { status: 'success', value: frequency };
};

/**
 * Compute the lead time for changes.
 * @param deployments
 * @param commits
 */
const calculateLeadTimeForChanges = ({ deployments, commits }: DoraMetricsData): DoraMetricType => {
    AppLogger.info(`[DoraMetricsUtils - calculateLeadTimeForChanges] start`);

    if (!commits || commits.length === 0 || !deployments || deployments.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateLeadTimeForChanges] commits or deployments is empty`,
        );
        return { status: 'failure', value: 0 };
    }

    const leadTimes = deployments
        .filter((deploy) => deploy.status === 'success')
        .map((deploy) => {
            const commitTime = commits.find((commit) => commit.id === deploy.sha)?.created_at;
            return commitTime
                ? (new Date(deploy.created_at).getTime() - new Date(commitTime).getTime()) /
                      MSTOHOURS
                : 0;
        })
        .filter((leadTime) => leadTime > 0);

    const leadTimeForChanges = leadTimes?.reduce((a, b) => a + b, 0) / leadTimes.length || 0;

    AppLogger.info(
        `[DoraMetricsUtils - calculateLeadTimeForChanges] leadTimeForChanges: ${leadTimeForChanges}`,
    );
    return { value: leadTimeForChanges, status: 'success' };
};

/**
 * Compute the change failure rate.
 */
const calculateChangeFailureRate = (): DoraMetricType => {
    // TODO: Implement the function
    AppLogger.info(`[DoraMetricsUtils - calculateChangeFailureRate] - Not implemented`);
    return { status: 'failure', value: 0 };
};

/**
 * Compute the mean time to restore service.
 */
const calculateMeanTimeToRestoreService = (): DoraMetricType => {
    // TODO: Implement the function
    AppLogger.info(`[DoraMetricsUtils - calculateMeanTimeToRestoreService] - Not implemented`);
    return { status: 'failure', value: 0 };
};

/**
 * Format the DORA metrics reports.
 * @param deployments
 * @param commits
 * @param application
 */
const analyseDoraMetrics = ({
    deployments,
    commits,
    application,
}: DoraMetricsAuditParamsType): AuditType[] | null => {
    try {
        AppLogger.info(`[DoraMetricsUtils - analyseDoraMetrics] start`);

        const report = {
            deploymentFrequency: calculateDeploymentFrequency({ deployments }),
            leadTimeForChanges: calculateLeadTimeForChanges({ deployments, commits }),
            changeFailureRate: calculateChangeFailureRate(),
            meanTimeToRestoreService: calculateMeanTimeToRestoreService(),
        };

        const auditReports: AuditType[] = [];

        auditReports.push({
            type: 'DORA_Metrics',
            category: 'deployment_frequency',
            status: report.deploymentFrequency.status,
            score: report.deploymentFrequency.value,
            scoreUnit: 'deployments/day',
            extraInfos: 'Number of deployments per day.',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            type: 'DORA_Metrics',
            category: 'lead_time_for_changes',
            status: report.leadTimeForChanges.status,
            score: report.leadTimeForChanges.value,
            scoreUnit: 'hours',
            extraInfos: 'Time between commit and deployment.',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            type: 'DORA_Metrics',
            category: 'change_failure_rate',
            status: report.changeFailureRate.status,
            score: report.changeFailureRate.value,
            scoreUnit: 'percentage',
            extraInfos: 'Percentage of failed deployments.',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            type: 'DORA_Metrics',
            category: 'mean_time_to_restore_service',
            status: report.meanTimeToRestoreService.status,
            score: report.meanTimeToRestoreService.value,
            scoreUnit: 'hours',
            extraInfos: 'Time to restore service after a failure.',
            module: {
                appId: application?._id,
            },
        });

        return auditReports;
    } catch (error) {
        AppLogger.error(
            '[DoraMetricsUtils - analyseDoraMetrics] An exception occurred during the audits:',
            error,
        );
    }
    return [];
};

const DoraMetricsUtils = {
    analyseDoraMetrics,

    calculateDeploymentFrequency,
    calculateLeadTimeForChanges,
    calculateChangeFailureRate,
    calculateMeanTimeToRestoreService,
};

export default DoraMetricsUtils;
