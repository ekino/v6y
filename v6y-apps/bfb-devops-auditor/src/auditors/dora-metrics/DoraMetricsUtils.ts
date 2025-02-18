import { AppLogger, AuditType, Matcher, auditStatus } from '@v6y/core-logic';
import { devOpsCategories, devOpsType } from '@v6y/core-logic/src/config/DevOpsConfig.ts';

import {
    DeploymentFrequencyParamsType,
    DoraMetricType,
    DoraMetricsAuditParamsType,
    LeadReviewTimeParamsType,
    LeadTimeForChangesParamsType,
} from '../types/DoraMetricsAuditType.ts';

const MSTOHOURS = 1000 * 60 * 60;

const frequencyCalculation = (deploymentTimes: Date[], timePeriod: number): number => {
    return timePeriod > 0 ? deploymentTimes.length / timePeriod : deploymentTimes.length;
};

/**
 * Compute the deployment frequency.
 * @param deployments
 * @param dateStart
 * @param dateEnd
 */
const calculateDeploymentFrequency = ({
    deployments,
    dateStart,
    dateEnd,
}: DeploymentFrequencyParamsType): DoraMetricType => {
    AppLogger.info(`[DoraMetricsUtils - calculateDeploymentFrequency] start`);

    if (!deployments || deployments.length === 0) {
        AppLogger.info(`[DoraMetricsUtils - calculateDeploymentFrequency] deployments is empty`);
        return { status: auditStatus.error, value: 0 };
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    const deploymentTimes = deployments
        .filter((d) => d.status === 'success')
        .map((d) => new Date(d.deployable.finished_at))
        .filter((date) => date >= start && date <= end)
        .sort((a, b) => a.getTime() - b.getTime());

    if (deploymentTimes.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateDeploymentFrequency] no successful deployments in date range`,
        );
        return { status: auditStatus.error, value: 0 };
    }

    const timePeriod = (end.getTime() - start.getTime()) / (MSTOHOURS * 24);
    const frequency = frequencyCalculation(deploymentTimes, timePeriod);

    AppLogger.info(
        `[DoraMetricsUtils - calculateDeploymentFrequency] deployment frequency: ${frequency}`,
    );

    const status = Matcher()
        .on(
            () => frequency >= 1,
            () => auditStatus.success, // Elite Performers: Multiple times a day
        )
        .on(
            () => frequency >= 1 / 7,
            () => auditStatus.info, // High Performers: Once a week to once a month
        )
        .on(
            () => frequency >= 1 / 30,
            () => auditStatus.warning, // Medium Performers: Once a month to once every 6 months
        )
        .otherwise(() => auditStatus.warning); // Low Performers: Less than once every 6 months

    return { status: status as string, value: frequency };
};

/**
 * Compute the lead review time.
 * @param mergeRequests
 * @param dateStart
 * @param dateEnd
 */
const calculateLeadReviewTime = ({
    mergeRequests,
    dateStart,
    dateEnd,
}: LeadReviewTimeParamsType): DoraMetricType => {
    AppLogger.info(`[DoraMetricsUtils - calculateLeadReviewTime] start`);

    if (!mergeRequests || mergeRequests.length === 0) {
        AppLogger.info(`[DoraMetricsUtils - calculateLeadReviewTime] mergeRequests is empty`);
        return { status: auditStatus.error, value: 0 };
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    const leadTimes = mergeRequests
        // Filter MRs that have been merged
        .filter((mr) => mr.merged_at)
        // Filter MRs within the date range based on merge date
        .filter((mr) => {
            const mergeDate = new Date(mr.merged_at);
            return mergeDate >= start && mergeDate <= end;
        })
        // Calculate lead review time for each MR (time between creation and merge)
        .map((mr) => {
            const createTime = new Date(mr.created_at);
            const mergeTime = new Date(mr.merged_at);
            return (mergeTime.getTime() - createTime.getTime()) / MSTOHOURS;
        })
        // Filter out negative or zero lead times
        .filter((leadTime) => leadTime > 0);

    const leadTimeForChanges = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length || 0;

    AppLogger.info(
        `[DoraMetricsUtils - calculateLeadReviewTime] lead review time: ${leadTimeForChanges}`,
    );
    const status = Matcher()
        .on(
            () => leadTimeForChanges < 1,
            () => auditStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => leadTimeForChanges < 24 * 7,
            () => auditStatus.info, // High Performers: 1 day to 1 week
        )
        .on(
            () => leadTimeForChanges < 24 * 30 * 6,
            () => auditStatus.warning, // Medium Performers: 1 month to 6 months
        )
        .otherwise(() => auditStatus.warning); // Low Performers: More than 6 months

    return { value: leadTimeForChanges, status: status as string };
};

/**
 * Compute the lead time for changes.
 * @param leadReviewTime
 * @param deployments
 * @param dateStart
 * @param dateEnd
 */
const calculateLeadTimeForChanges = ({
    leadReviewTime,
    deployments,
    dateStart,
    dateEnd,
}: LeadTimeForChangesParamsType): DoraMetricType => {
    // calculate the average time between the creation of the deployment and the finish, then add it to the leadReviewTime

    if (!deployments || deployments.length === 0 || !leadReviewTime || leadReviewTime === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateLeadTimeForChanges] deployments or leadReviewTime is empty`,
        );
        return { status: auditStatus.error, value: 0 };
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    const deploymentLeadTimes = deployments
        .filter(
            (d) =>
                d.status === 'success' &&
                new Date(d.deployable.finished_at) >= start &&
                new Date(d.deployable.finished_at) <= end,
        )
        .map((d) => {
            const createTime = new Date(d.deployable.created_at);
            const finishTime = new Date(d.deployable.finished_at);
            return (finishTime.getTime() - createTime.getTime()) / MSTOHOURS;
        })
        .filter((leadTime) => leadTime > 0);

    const averageDeploymentLeadTime =
        deploymentLeadTimes.reduce((a, b) => a + b, 0) / deploymentLeadTimes.length || 0;

    const leadTimeForChanges = leadReviewTime + averageDeploymentLeadTime;

    const status = Matcher()
        .on(
            () => leadTimeForChanges < 1,
            () => auditStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => leadTimeForChanges < 24 * 7,
            () => auditStatus.info, // High Performers: 1 day to 1 week
        )
        .on(
            () => leadTimeForChanges < 24 * 30 * 6,
            () => auditStatus.warning, // Medium Performers: 1 month to 6 months
        )
        .otherwise(() => auditStatus.warning); // Low Performers: More than 6 months

    return { value: leadTimeForChanges, status: status as string };
};

/**
 * Compute the change failure rate.
 */
const calculateChangeFailureRate = (): DoraMetricType => {
    // TODO: Implement the function
    AppLogger.info(`[DoraMetricsUtils - calculateChangeFailureRate] - Not implemented`);

    const value = 0;

    let status = Matcher()
        .on(
            () => value <= 15,
            () => auditStatus.success, // Elite Performers: 0-15%
        )
        .on(
            () => value <= 30,
            () => auditStatus.info, // High, Medium, and Low Performers: 16-30%
        )
        .otherwise(() => auditStatus.warning); // Above 30%

    status = auditStatus.error;

    return { status: status as string, value };
};

/**
 * Compute the mean time to restore service.
 */
const calculateMeanTimeToRestoreService = (): DoraMetricType => {
    // TODO: Implement the function
    AppLogger.info(`[DoraMetricsUtils - calculateMeanTimeToRestoreService] - Not implemented`);

    const value = 0;

    let status = Matcher()
        .on(
            () => value < 1,
            () => auditStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => value < 24,
            () => auditStatus.info, // High Performers: Less than 1 day
        )
        .on(
            () => value < 24 * 7,
            () => auditStatus.warning, // Medium Performers: 1 day to 1 week
        )
        .otherwise(() => auditStatus.warning); // Low Performers: Over 6 months

    status = auditStatus.error;

    return { status: status as string, value };
};

/**
 * Format the DORA metrics reports.
 * @param deployments
 * @param commits
 * @param application
 */
const analyseDoraMetrics = ({
    deployments,
    mergeRequests,
    application,
    dateStart,
    dateEnd,
}: DoraMetricsAuditParamsType): AuditType[] | null => {
    try {
        AppLogger.info(`[DoraMetricsUtils - analyseDoraMetrics] start`);

        const deploymentFrequency = calculateDeploymentFrequency({
            deployments,
            dateStart,
            dateEnd,
        });
        const leadReviewTime = calculateLeadReviewTime({
            mergeRequests,
            dateStart,
            dateEnd,
        });

        const leadTimeForChanges =
            leadReviewTime.status === auditStatus.error
                ? { status: auditStatus.error, value: 0 }
                : calculateLeadTimeForChanges({
                      leadReviewTime: leadReviewTime.value,
                      deployments,
                      dateStart,
                      dateEnd,
                  });
        const changeFailureRate = calculateChangeFailureRate();
        const meanTimeToRestoreService = calculateMeanTimeToRestoreService();

        const auditReports: AuditType[] = [];

        auditReports.push({
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
            type: devOpsType.DORA,
            category: devOpsCategories.DEPLOYMENT_FREQUENCY,
            status: deploymentFrequency.status,
            score: deploymentFrequency.value,
            scoreUnit: 'deployments/day',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
            type: devOpsType.DORA,
            category: devOpsCategories.LEAD_REVIEW_TIME,
            status: leadReviewTime.status,
            score: leadReviewTime.value,
            scoreUnit: 'hours',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
            type: devOpsType.DORA,
            category: devOpsCategories.LEAD_TIME_FOR_CHANGES,
            status: leadTimeForChanges.status,
            score: leadTimeForChanges.value,
            scoreUnit: 'hours',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
            type: devOpsType.DORA,
            category: devOpsCategories.CHANGE_FAILURE_RATE,
            status: changeFailureRate.status,
            score: changeFailureRate.value,
            scoreUnit: 'percentage',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            dateStart: new Date(dateStart),
            dateEnd: new Date(dateEnd),
            type: devOpsType.DORA,
            category: devOpsCategories.MEAN_TIME_TO_RESTORE_SERVICE,
            status: meanTimeToRestoreService.status,
            score: meanTimeToRestoreService.value,
            scoreUnit: 'hours',
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
    calculateLeadReviewTime,
    calculateLeadTimeForChanges,
    calculateChangeFailureRate,
    calculateMeanTimeToRestoreService,
};

export default DoraMetricsUtils;
