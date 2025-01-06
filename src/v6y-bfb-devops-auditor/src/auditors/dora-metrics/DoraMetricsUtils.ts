import { AppLogger, AuditType } from '@v6y/commons';

import {
    DoraMetricsAuditParamsType,
    DoraMetricsData,
    DoraMetricsReportType,
} from './types/DoraMetricsAuditType.ts';

/**
 * Compute the deployment frequency.
 * @param deployments
 */
const computeDeploymentFrequency = ({ deployments }: DoraMetricsData): number => {
    if (deployments) {
        const deploymentTimes = deployments.map((d) => new Date(d.created_at));
        deploymentTimes.sort();
        const timePeriod =
            (deploymentTimes[deploymentTimes.length - 1].getTime() - deploymentTimes[0].getTime()) /
            (1000 * 60 * 60 * 24);
        const frequency = timePeriod > 0 ? deployments.length / timePeriod : deployments.length;
        return frequency;
    }
    return 0;
};

/**
 * Compute the lead time for changes.
 * @param deployments
 * @param commits
 */
const computeLeadTimeForChanges = ({ deployments, commits }: DoraMetricsData): number => {
    const commitTimes: { [key: string]: Date } = {};
    if (!commits) {
        return 0;
    }
    for (const commit of commits) {
        commitTimes[commit.id] = new Date(commit.created_at);
    }

    if (!deployments) {
        return 0;
    }
    const leadTimes = deployments
        .filter((deploy) => deploy.sha in commitTimes)
        .map(
            (deploy) =>
                (new Date(deploy.created_at).getTime() - commitTimes[deploy.sha].getTime()) /
                (1000 * 60 * 60),
        );

    return leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b) / leadTimes.length : 0;
};

/**
 * Compute the change failure rate.
 */
const computeChangeFailureRate = () => {
    // TODO: Implement the function
    return 0;
};

/**
 * Compute the mean time to restore service.
 */
const computeMeanTimeToRestoreService = () => {
    // TODO: Implement the function
    return 0;
};

const computeDoraMetricsReport = ({
    deployments,
    commits,
}: DoraMetricsData): DoraMetricsReportType => {
    return {
        deploymentFrequency: computeDeploymentFrequency({ deployments }),
        leadTimeForChanges: computeLeadTimeForChanges({ deployments, commits }),
        changeFailureRate: computeChangeFailureRate(),
        meanTimeToRestoreService: computeMeanTimeToRestoreService(),
    };
};

/**
 * Format the DORA metrics reports.
 * @param reports
 * @param application
 */
const formatDoraMetricsReport = ({
    report,
    application,
}: DoraMetricsAuditParamsType): AuditType => {
    // TODO: Implement the function
    AppLogger.info(
        `[DoraMetricsUtils - formatDoraMetricsReport] report: ${JSON.stringify(report)}`,
    );
    AppLogger.info(
        `[DoraMetricsUtils - formatDoraMetricsReport] application _id: ${application._id}`,
    );

    return {};
};

const DoraMetricsUtils = {
    computeDoraMetricsReport,
    formatDoraMetricsReport,
};

export default DoraMetricsUtils;
