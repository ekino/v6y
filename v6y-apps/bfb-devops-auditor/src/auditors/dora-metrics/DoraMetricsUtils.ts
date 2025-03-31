import { AppLogger, AuditType, DateUtils, Matcher, auditStatus } from '@v6y/core-logic';
import { devOpsCategories, devOpsType } from '@v6y/core-logic/src/config/DevOpsConfig.ts';

import {
    CalculateMeanTimeToRestoreServiceParams,
    CalculateUpTimeAverageParams,
    DeploymentFrequencyParamsType,
    DoraMetricType,
    DoraMetricsAuditParamsType,
    LeadReviewTimeParamsType,
    LeadTimeForChangesParamsType,
    ServerDowntimePeriodType,
    calculateDownTimePeriodsParams,
} from '../types/DoraMetricsAuditType.ts';

const { formatStringToDate, formatDateToTimestamp } = DateUtils;

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

    const deploymentTimes = deployments
        .filter((d) => d.status === 'success')
        .map((d) => formatStringToDate(d.deployable.finished_at))
        .filter((date) => date >= dateStart && date <= dateEnd)
        .sort((a, b) => a.getTime() - b.getTime());

    if (deploymentTimes.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateDeploymentFrequency] no successful deployments in date range`,
        );
        return { status: auditStatus.error, value: 0 };
    }

    const timePeriod = (dateEnd.getTime() - dateStart.getTime()) / (MSTOHOURS * 24);
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

    const leadTimes = mergeRequests
        // Filter MRs that have been merged
        .filter((mr) => mr.merged_at)
        // Filter MRs within the date range based on merge date
        .filter((mr) => {
            const mergeDate = formatStringToDate(mr.merged_at);
            return mergeDate >= dateStart && mergeDate <= dateEnd;
        })
        // Calculate lead review time for each MR (time between creation and merge)
        .map((mr) => {
            const createTime = formatStringToDate(mr.created_at);
            const mergeTime = formatStringToDate(mr.merged_at);
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

    const deploymentLeadTimes = deployments
        .filter(
            (d) =>
                d.status === 'success' &&
                formatStringToDate(d.deployable.finished_at) >= dateStart &&
                formatStringToDate(d.deployable.finished_at) <= dateEnd,
        )
        .map((d) => {
            const createTime = formatStringToDate(d.deployable.created_at);
            const finishTime = formatStringToDate(d.deployable.finished_at);
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
 * @param data
 * @param dateStart
 * @param dateEnd
 */
const calculateChangeFailureRate = (): DoraMetricType => {
    const value = -1;

    const status = Matcher()
        .on(
            () => value <= 0,
            () => auditStatus.error,
        )
        .on(
            () => value <= 15,
            () => auditStatus.success, // Elite Performers: 0-15%
        )
        .on(
            () => value <= 30,
            () => auditStatus.info, // High, Medium, and Low Performers: 16-30%
        )
        .otherwise(() => auditStatus.warning); // Above 30%

    return { status: status as string, value };
};

/**
 * Compute the downtime periods.
 * @param dataDogEvents
 * @param dateStart
 * @param dateEnd
 */
const calculateDownTimePeriods = ({
    monitoringEvents,
    dateStart,
    dateEnd,
}: calculateDownTimePeriodsParams): ServerDowntimePeriodType[] => {
    const dateStartTimeStamp = formatDateToTimestamp(dateStart, 'ms');
    const dateEndTimeStamp = formatDateToTimestamp(dateEnd, 'ms');

    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] dateStartTimeStamp: ${dateStartTimeStamp}`,
    );

    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] dateEndTimeStamp: ${dateEndTimeStamp}`,
    );

    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] monitoringEvents count: ${monitoringEvents.length}`,
    );

    const downtimePeriods: ServerDowntimePeriodType[] = [];

    let currentDown: {
        start_time: number;
        start_id: string;
    } | null = null;

    for (const event of monitoringEvents) {
        const eventTime = event.timestamp;

        if (event.status === 'error') {
            if (!currentDown) {
                currentDown = {
                    start_time: eventTime,
                    start_id: event.id,
                };
            }
        } else if (event.status === 'success' && currentDown) {
            const downtimeDuration = event.timestamp - currentDown.start_time;

            downtimePeriods.push({
                start_time: currentDown.start_time,
                end_time: eventTime,
                duration_miliseconds: downtimeDuration,
                start_id: currentDown.start_id,
                end_id: event.id,
            });
            currentDown = null;
        }
    }

    if (currentDown) {
        const endTime = dateEndTimeStamp;
        const downtimeDuration = endTime - currentDown.start_time;

        downtimePeriods.push({
            start_time: currentDown.start_time,
            end_time: null,
            duration_miliseconds: downtimeDuration,
            start_id: currentDown.start_id,
            end_id: '',
        });
    }

    return downtimePeriods;
};

/**
 * Compute the mean time to restore service.
 * @param downtimePeriods
 */
const calculateMeanTimeToRestoreService = ({
    downtimePeriods,
}: CalculateMeanTimeToRestoreServiceParams): DoraMetricType => {
    const meanTimeToRestoreService =
        downtimePeriods.reduce((acc, period) => acc + period.duration_miliseconds, 0) /
            downtimePeriods.length || 0;

    AppLogger.info(
        `[DoraMetricsUtils - calculateMeanTimeToRestoreService] meanTimeToRestoreService: ${meanTimeToRestoreService}`,
    );

    const value = meanTimeToRestoreService / MSTOHOURS;

    const status = Matcher()
        .on(
            () => value <= 0,
            () => auditStatus.error,
        )
        .on(
            () => value < 1,
            () => auditStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => value < 24,
            () => auditStatus.info, // High Performers: Less than 1 day
        )
        .otherwise(() => auditStatus.warning); // Medium Performers: 1 day to 1 week and Low Performers: over 1 weeks

    return { status: status as string, value };
};

/**
 * Compute the uptime average.
 * @param downtimePeriods
 * @param dateStart
 * @param dateEnd
 */
const calculateUpTimeAverage = ({
    downtimePeriods,
    dateStart,
    dateEnd,
}: CalculateUpTimeAverageParams): DoraMetricType => {
    const dateStartTimeStamp = formatDateToTimestamp(dateStart, 'ms');
    const dateEndTimeStamp = formatDateToTimestamp(dateEnd, 'ms');

    const downtime = downtimePeriods.reduce((acc, period) => acc + period.duration_miliseconds, 0);
    const totalPeriod = dateEndTimeStamp - dateStartTimeStamp;
    const upTime = totalPeriod - downtime;
    const upTimeAverage = upTime / totalPeriod;

    AppLogger.info(
        `[DoraMetricsUtils - calculateUpTimeAverage] upTimeAverage: ${upTimeAverage * 100}%`,
    );

    const status = Matcher()
        .on(
            () => upTimeAverage <= 0,
            () => auditStatus.error,
        )
        .on(
            () => upTimeAverage > 0.95,
            () => auditStatus.success, // Elite Performers: 95% or more
        )
        .on(
            () => upTimeAverage > 0.85,
            () => auditStatus.info, // High Performers: 85% to 95%
        )
        .on(
            () => upTimeAverage > 0.7,
            () => auditStatus.warning, // Medium Performers: 70% to 85%
        )
        .otherwise(() => auditStatus.warning); // Low Performers: Less than 70%

    return { status: status as string, value: upTimeAverage * 100 };
};

/**
 * Format the DORA metrics reports.
 * @param deployments
 * @param mergeRequests
 * @param dataDogEvents
 * @param application
 * @param dateStart
 * @param dateEnd
 */
const analyseDoraMetrics = ({
    deployments,
    mergeRequests,
    monitoringEvents,
    application,
    dateStart,
    dateEnd,
}: DoraMetricsAuditParamsType): AuditType[] => {
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

        const downtimePeriods = calculateDownTimePeriods({ monitoringEvents, dateStart, dateEnd });

        const meanTimeToRestoreService = calculateMeanTimeToRestoreService({
            downtimePeriods,
        });

        const upTimeAverage = calculateUpTimeAverage({ downtimePeriods, dateStart, dateEnd });

        const auditReports: AuditType[] = [];

        auditReports.push({
            dateStart: dateStart,
            dateEnd: dateEnd,
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
            dateStart: dateStart,
            dateEnd: dateEnd,
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
            dateStart: dateStart,
            dateEnd: dateEnd,
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
            dateStart: dateStart,
            dateEnd: dateEnd,
            type: devOpsType.DORA,
            category: devOpsCategories.CHANGE_FAILURE_RATE,
            status: changeFailureRate.status,
            score: changeFailureRate.value,
            scoreUnit: '%',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            dateStart: dateStart,
            dateEnd: dateEnd,
            type: devOpsType.DORA,
            category: devOpsCategories.MEAN_TIME_TO_RESTORE_SERVICE,
            status: meanTimeToRestoreService.status,
            score: meanTimeToRestoreService.value,
            scoreUnit: 'hours',
            module: {
                appId: application?._id,
            },
        });

        auditReports.push({
            dateStart: dateStart,
            dateEnd: dateEnd,
            type: devOpsType.DORA,
            category: devOpsCategories.UP_TIME_AVERAGE,
            status: upTimeAverage.status,
            score: upTimeAverage.value,
            scoreUnit: '%',
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
    calculateUpTimeAverage,
    calculateDownTimePeriods,
};

export default DoraMetricsUtils;
