import { AppLogger, AuditType } from '@v6y/core-logic';

import {
    DoraMetricType,
    DoraMetricsAuditParamsType,
    DoraMetricsData,
    DoraMetricsReportType,
} from '../types/DoraMetricsAuditType.ts';

const MSTOHOURS = 1000 * 60 * 60;

/**
 * Compute the deployment frequency.
 * @param deployments
 */
const computeDeploymentFrequency = ({ deployments }: DoraMetricsData): DoraMetricType => {
    AppLogger.info(`[DoraMetricsUtils - computeDeploymentFrequency] start`);
    if (deployments && deployments.length > 0) {
        const deploymentTimes = deployments.map((d) => new Date(d.created_at));
        deploymentTimes.sort((a, b) => a.getTime() - b.getTime());
        const timePeriod =
            (deploymentTimes[deploymentTimes.length - 1].getTime() - deploymentTimes[0].getTime()) /
            (MSTOHOURS * 24);
        const frequency = timePeriod > 0 ? deployments.length / timePeriod : deployments.length;
        AppLogger.info(
            `[DoraMetricsUtils - computeDeploymentFrequency] deployement frequency: ${frequency}`,
        );
        return { status: 'success', value: frequency };
    }
    AppLogger.info(`[DoraMetricsUtils - computeDeploymentFrequency] deployments is empty`);
    return { status: 'failure', value: 0 };
};

/**
 * Compute the lead time for changes.
 * @param deployments
 * @param commits
 */
const computeLeadTimeForChanges = ({ deployments, commits }: DoraMetricsData): DoraMetricType => {
    AppLogger.info(`[DoraMetricsUtils - computeLeadTimeForChanges] start`);
    const commitTimes: { [key: string]: Date } = {};
    if (!commits || commits.length === 0) {
        AppLogger.info(`[DoraMetricsUtils - computeLeadTimeForChanges] commits is empty`);
        return { status: 'failure', value: 0 };
    }
    if (!deployments || deployments.length === 0) {
        AppLogger.info(`[DoraMetricsUtils - computeLeadTimeForChanges] deployments is empty`);
        return { status: 'failure', value: 0 };
    }

    for (const commit of commits) {
        commitTimes[commit.id] = new Date(commit.created_at);
    }

    const leadTimes = deployments
        .filter((deploy) => deploy.sha in commitTimes)
        .map(
            (deploy) =>
                (new Date(deploy.created_at).getTime() - commitTimes[deploy.sha].getTime()) /
                (MSTOHOURS * 24),
        );

    const leadTimeForChanges =
        leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b) / leadTimes.length : 0;
    AppLogger.info(
        `[DoraMetricsUtils - computeLeadTimeForChanges] leadTimeForChanges: ${leadTimeForChanges}`,
    );
    return { value: leadTimeForChanges, status: 'success' };
};

/**
 * Compute the change failure rate.
 */
const computeChangeFailureRate = (): DoraMetricType => {
    // TODO: Implement the function
    AppLogger.info(`[DoraMetricsUtils - computeChangeFailureRate] - Not implemented`);
    return { status: 'failure', value: 0 };
};

/**
 * Compute the mean time to restore service.
 */
const computeMeanTimeToRestoreService = (): DoraMetricType => {
    // TODO: Implement the function
    AppLogger.info(`[DoraMetricsUtils - computeMeanTimeToRestoreService] - Not implemented`);
    return { status: 'failure', value: 0 };
};

/**
 * Compute the DORA metrics report.
 * @param deployments
 * @param commits
 */
const computeDoraMetricsReport = ({
    deployments,
    commits,
}: DoraMetricsData): DoraMetricsReportType => {
    AppLogger.info(
        `[DoraMetricsUtils - computeDoraMetricsReport] deployments: ${deployments?.length}`,
    );
    AppLogger.info(`[DoraMetricsUtils - computeDoraMetricsReport] commits: ${commits?.length}`);
    const DoraMetricsReport = {
        deploymentFrequency: computeDeploymentFrequency({ deployments }),
        leadTimeForChanges: computeLeadTimeForChanges({ deployments, commits }),
        changeFailureRate: computeChangeFailureRate(),
        meanTimeToRestoreService: computeMeanTimeToRestoreService(),
    };

    return DoraMetricsReport;
};

/**
 * Format the DORA metrics reports.
 * @param reports
 * @param application
 */
const formatDoraMetricsReports = ({
    report,
    application,
}: DoraMetricsAuditParamsType): AuditType[] | null => {
    try {
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
            '[DoraMetricsUtils - formatDoraMetricsReports] An exception occurred during the audits:',
            error,
        );
    }
    return [];
};

const DoraMetricsUtils = {
    computeDoraMetricsReport,
    formatDoraMetricsReports,
};

export default DoraMetricsUtils;
