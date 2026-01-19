import {
    AppLogger,
    AuditType,
    DateUtils,
    Matcher,
    auditStatus,
    scoreStatus,
} from '@v6y/core-logic';
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
    AppLogger.info(
        `[DoraMetricsUtils - calculateDeploymentFrequency] deployments input type: ${typeof deployments}, isArray: ${Array.isArray(deployments)}, length: ${deployments?.length}`,
    );

    const deploymentsArray = Array.isArray(deployments) ? deployments : [];

    if (deploymentsArray.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateDeploymentFrequency] deployments is empty - this could indicate no deployments in the time period or API access issues`,
        );
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const deploymentTimes = deploymentsArray
        .filter((d) => d && d.status === 'success')
        .map((d) => formatStringToDate(d.deployable?.finished_at))
        .filter((date) => date && date >= dateStart && date <= dateEnd)
        .sort((a, b) => a.getTime() - b.getTime());

    if (deploymentTimes.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateDeploymentFrequency] no successful deployments in date range`,
        );
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const timePeriod = (dateEnd.getTime() - dateStart.getTime()) / (MSTOHOURS * 24);
    const frequency = frequencyCalculation(deploymentTimes, timePeriod);

    AppLogger.info(
        `[DoraMetricsUtils - calculateDeploymentFrequency] deployment frequency: ${frequency}`,
    );

    const status = Matcher()
        .on(
            () => frequency >= 1,
            () => scoreStatus.success, // Elite Performers: Multiple times a day
        )
        .on(
            () => frequency >= 1 / 7,
            () => scoreStatus.info, // High Performers: Once a week to once a month
        )
        .on(
            () => frequency >= 1 / 30,
            () => scoreStatus.warning, // Medium Performers: Once a month to once every 6 months
        )
        .otherwise(() => scoreStatus.error); // Low Performers: Less than once every 6 months

    return { auditStatus: auditStatus.success, valueStatus: status as string, value: frequency };
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
    AppLogger.info(
        `[DoraMetricsUtils - calculateLeadReviewTime] mergeRequests input type: ${typeof mergeRequests}, isArray: ${Array.isArray(mergeRequests)}, length: ${mergeRequests?.length}`,
    );

    // Ensure mergeRequests is an array
    const mergeRequestsArray = Array.isArray(mergeRequests) ? mergeRequests : [];

    if (mergeRequestsArray.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateLeadReviewTime] mergeRequests is empty - this could indicate no merge requests in the time period or API access issues`,
        );
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const leadTimes = mergeRequestsArray
        // Filter MRs that have been merged
        .filter((mr) => mr && mr.merged_at)
        // Filter MRs within the date range based on merge date
        .filter((mr) => {
            const mergeDate = formatStringToDate(mr.merged_at);
            return mergeDate && mergeDate >= dateStart && mergeDate <= dateEnd;
        })
        // Calculate lead review time for each MR (time between creation and merge)
        .map((mr) => {
            const createTime = formatStringToDate(mr.created_at);
            const mergeTime = formatStringToDate(mr.merged_at);
            if (!createTime || !mergeTime) return null;
            return (mergeTime.getTime() - createTime.getTime()) / MSTOHOURS;
        })
        // Filter out null values and negative or zero lead times
        .filter((leadTime) => leadTime !== null && leadTime > 0);

    if (leadTimes.length === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateLeadReviewTime] no valid merge requests found in date range`,
        );
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const leadTimeForChanges = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length || 0;

    AppLogger.info(
        `[DoraMetricsUtils - calculateLeadReviewTime] lead review time: ${leadTimeForChanges}`,
    );
    const status = Matcher()
        .on(
            () => leadTimeForChanges < 1,
            () => scoreStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => leadTimeForChanges < 24 * 7,
            () => scoreStatus.info, // High Performers: 1 day to 1 week
        )
        .on(
            () => leadTimeForChanges < 24 * 30 * 6,
            () => scoreStatus.warning, // Medium Performers: 1 month to 6 months
        )
        .otherwise(() => scoreStatus.error); // Low Performers: More than 6 months

    return {
        value: leadTimeForChanges,
        valueStatus: status as string,
        auditStatus: auditStatus.success,
    };
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
    AppLogger.info(
        `[DoraMetricsUtils - calculateLeadTimeForChanges] start with leadReviewTime: ${leadReviewTime}`,
    );

    // Ensure deployments is an array
    const deploymentsArray = Array.isArray(deployments) ? deployments : [];

    if (deploymentsArray.length === 0 || !leadReviewTime || leadReviewTime === 0) {
        AppLogger.info(
            `[DoraMetricsUtils - calculateLeadTimeForChanges] deployments is empty or leadReviewTime is invalid`,
        );
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const deploymentLeadTimes = deploymentsArray
        .filter(
            (d) =>
                d &&
                d.status === 'success' &&
                d.deployable?.finished_at &&
                d.deployable?.created_at &&
                formatStringToDate(d.deployable.finished_at) >= dateStart &&
                formatStringToDate(d.deployable.finished_at) <= dateEnd,
        )
        .map((d) => {
            const createTime = formatStringToDate(d.deployable.created_at);
            const finishTime = formatStringToDate(d.deployable.finished_at);
            if (!createTime || !finishTime) return null;
            return (finishTime.getTime() - createTime.getTime()) / MSTOHOURS;
        })
        .filter((leadTime) => leadTime !== null && leadTime > 0);

    const averageDeploymentLeadTime =
        deploymentLeadTimes.length > 0
            ? deploymentLeadTimes.reduce((a, b) => a + b, 0) / deploymentLeadTimes.length
            : 0;

    const leadTimeForChanges = leadReviewTime + averageDeploymentLeadTime;

    AppLogger.info(
        `[DoraMetricsUtils - calculateLeadTimeForChanges] final lead time: ${leadTimeForChanges}`,
    );

    if (leadTimeForChanges <= 0) {
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const status = Matcher()
        .on(
            () => leadTimeForChanges < 1,
            () => scoreStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => leadTimeForChanges < 24 * 7,
            () => scoreStatus.info, // High Performers: 1 day to 1 week
        )
        .on(
            () => leadTimeForChanges < 24 * 30 * 6,
            () => scoreStatus.warning, // Medium Performers: 1 month to 6 months
        )
        .otherwise(() => scoreStatus.error); // Low Performers: More than 6 months

    return {
        auditStatus: auditStatus.success,
        value: leadTimeForChanges,
        valueStatus: status as string,
    };
};

/**
 * Compute the change failure rate.
 * @param data
 * @param dateStart
 * @param dateEnd
 */
const calculateChangeFailureRate = (): DoraMetricType => {
    // Elite Performers: 0-15%
    // High and Medium Performers: 16-30%
    // Low Performers: Above 30%

    // Function not implemented yet - return failure status
    return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
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
    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] monitoringEvents input type: ${typeof monitoringEvents}, isArray: ${Array.isArray(monitoringEvents)}, length: ${monitoringEvents?.length}`,
    );

    // Ensure monitoringEvents is an array
    const eventsArray = Array.isArray(monitoringEvents) ? monitoringEvents : [];

    const dateStartTimeStamp = formatDateToTimestamp(dateStart, 'ms');
    const dateEndTimeStamp = formatDateToTimestamp(dateEnd, 'ms');

    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] dateStartTimeStamp: ${dateStartTimeStamp}`,
    );

    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] dateEndTimeStamp: ${dateEndTimeStamp}`,
    );

    AppLogger.info(
        `[DoraMetricsUtils - calculateDownTimePeriods] monitoringEvents count: ${eventsArray.length}`,
    );

    const downtimePeriods: ServerDowntimePeriodType[] = [];

    let currentDown: {
        start_time: number;
        start_id: string;
    } | null = null;

    for (const event of eventsArray) {
        if (!event || !event.timestamp || !event.id) {
            continue; // Skip invalid events
        }

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

    if (value <= 0) {
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const status = Matcher()
        .on(
            () => value < 1,
            () => scoreStatus.success, // Elite Performers: Less than 1 hour
        )
        .on(
            () => value < 24,
            () => scoreStatus.info, // High Performers: Less than 1 day
        )
        .on(
            () => value < 24 * 7,
            () => scoreStatus.warning, // Medium Performers: 1 day to 1 week
        )
        .otherwise(() => scoreStatus.error); // Low Performers: over 1 weeks

    return { auditStatus: auditStatus.success, valueStatus: status as string, value };
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

    if (upTimeAverage <= 0) {
        return { auditStatus: auditStatus.failure, valueStatus: null, value: null };
    }

    const status = Matcher()
        .on(
            () => upTimeAverage > 0.95,
            () => scoreStatus.success, // Elite Performers: 95% or more
        )
        .on(
            () => upTimeAverage > 0.85,
            () => scoreStatus.info, // High Performers: 85% to 95%
        )
        .on(
            () => upTimeAverage > 0.7,
            () => scoreStatus.warning, // Medium Performers: 70% to 85%
        )
        .otherwise(() => scoreStatus.error); // Low Performers: Less than 70%

    return {
        auditStatus: auditStatus.success,
        valueStatus: status as string,
        value: upTimeAverage * 100,
    };
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

        // Comprehensive data availability diagnostics
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] === DATA AVAILABILITY DIAGNOSTICS ===`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] deployments: type=${typeof deployments}, isArray=${Array.isArray(deployments)}, length=${deployments?.length || 'undefined'}`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] mergeRequests: type=${typeof mergeRequests}, isArray=${Array.isArray(mergeRequests)}, length=${mergeRequests?.length || 'undefined'}`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] monitoringEvents: type=${typeof monitoringEvents}, isArray=${Array.isArray(monitoringEvents)}, length=${monitoringEvents?.length || 'undefined'}`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] application: id=${application?._id}, name=${application?.name}`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] dateRange: ${dateStart} to ${dateEnd}`,
        );
        AppLogger.info(`[DoraMetricsUtils - analyseDoraMetrics] === EXPECTED METRICS ===`);
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] DEPLOYMENT_FREQUENCY: requires deployments array`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] LEAD_REVIEW_TIME: requires mergeRequests array`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] LEAD_TIME_FOR_CHANGES: requires mergeRequests array`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] CHANGE_FAILURE_RATE: requires deployments array`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] MEAN_TIME_TO_RESTORE_SERVICE: requires monitoringEvents array`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] UP_TIME_AVERAGE: requires monitoringEvents array`,
        );
        AppLogger.info(
            `[DoraMetricsUtils - analyseDoraMetrics] ================================================`,
        );

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
            leadReviewTime.auditStatus === auditStatus.failure || !leadReviewTime.value
                ? { auditStatus: auditStatus.failure, valueStatus: null, value: null }
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
            auditStatus: deploymentFrequency.auditStatus,
            scoreStatus: deploymentFrequency.valueStatus,
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
            auditStatus: leadReviewTime.auditStatus,
            scoreStatus: leadReviewTime.valueStatus,
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
            auditStatus: leadTimeForChanges.auditStatus,
            scoreStatus: leadTimeForChanges.valueStatus,
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
            auditStatus: changeFailureRate.auditStatus,
            scoreStatus: changeFailureRate.valueStatus,
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
            auditStatus: meanTimeToRestoreService.auditStatus,
            scoreStatus: meanTimeToRestoreService.valueStatus,
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
            auditStatus: upTimeAverage.auditStatus,
            scoreStatus: upTimeAverage.valueStatus,
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
