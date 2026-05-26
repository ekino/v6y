import {
    AccountType,
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    AuditRunProvider,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Get application details info by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationDetailsInfoByParams = async (
    _: unknown,
    args: ApplicationType,
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(`[ApplicationQueries - getApplicationDetailsInfoByParams] _id : ${_id}`);

        const appDetails = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsInfoByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationDetailsInfoByParams] error : ${error}`);
        return null;
    }
};

/**
 * Get application details audit reports by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationDetailsAuditReportsByParams = async (
    _: unknown,
    args: ApplicationType,
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(`[ApplicationQueries - getApplicationDetailsAuditReports] _id : ${_id}`);

        const auditsReports = await ApplicationProvider.getApplicationDetailsAuditReportsByParams({
            _id,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsAuditReports] auditsReports : ${auditsReports?.length}`,
        );

        return auditsReports;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationDetailsAuditReports] error : ${error}`);
        return [];
    }
};

/**
 * Get application audit runs history by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationAuditRunsByParams = async (
    _: unknown,
    args: ApplicationType,
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationAuditRuns] Received args:`, args);
        AppLogger.info(`[ApplicationQueries - getApplicationAuditRuns] _id : ${_id}`);

        if (!_id) {
            AppLogger.error('[ApplicationQueries - getApplicationAuditRuns] Missing _id parameter');
            return [];
        }

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                AppLogger.warn(
                    `[ApplicationQueries - getApplicationAuditRuns] Unauthorized access attempt for app ${_id}`,
                );
                throw new Error('Unauthorized');
            }
        }

        const auditRuns = await AuditRunProvider.getAuditRunsByAppId(_id);

        AppLogger.info(
            `[ApplicationQueries - getApplicationAuditRuns] Found ${auditRuns?.length} audit runs for app ${_id}`,
        );

        return auditRuns || [];
    } catch (error) {
        AppLogger.error(
            `[ApplicationQueries - getApplicationAuditRuns] error for app ${args?._id} : ${error}`,
        );
        return [];
    }
};

/**
 * Get application details evolutions by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationDetailsEvolutionsByParams = async (
    _: unknown,
    args: ApplicationType,
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsEvolutionsByParams] _id : ${_id}`,
        );

        const evolutions = await ApplicationProvider.getApplicationDetailsEvolutionsByParams({
            _id,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsEvolutionsByParams] evolutions : ${evolutions?.length}`,
        );

        return evolutions;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsEvolutionsByParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get application details dependencies by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationDetailsDependenciesByParams = async (
    _: unknown,
    args: ApplicationType,
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsDependenciesByParams] _id : ${_id}`,
        );

        const dependencies = await ApplicationProvider.getApplicationDetailsDependenciesByParams({
            _id,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsDependenciesByParams] dependencies : ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsDependenciesByParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get application details keywords by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationDetailsKeywordsByParams = async (
    _: unknown,
    args: ApplicationType,
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }
        AppLogger.info(`[ApplicationQueries - getApplicationDetailsKeywordsByParams] _id : ${_id}`);

        const keywords = await ApplicationProvider.getApplicationDetailsKeywordsByParams({
            _id,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsKeywordsByParams] keywords : ${keywords?.length}`,
        );

        return keywords;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsKeywordsByParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get application list by page and params
 * @param _
 * @param args
 * @param user
 */
const getApplicationListByPageAndParams = async (
    _: unknown,
    args: SearchQueryType,
    { user }: { user: AccountType },
) => {
    try {
        const { start, offset, limit, keywords, searchText, where, sort } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] start : ${start}`);
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] offset : ${offset}`,
        );
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] keywords : ${
                keywords?.join?.(',') || ''
            }`,
        );
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] searchText : ${searchText}`,
        );
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] where : ${where}`);
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] sort : ${sort}`);

        const appList = await ApplicationProvider.getApplicationListByPageAndParams(
            {
                searchText,
                keywords,
                offset: offset !== undefined ? offset : start || 0,
                limit,
                where,
            },
            user,
        );

        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] Number of apps : ${appList?.length}`,
        );

        return appList;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] error : ${error}`);
        return [];
    }
};

/**
 * Get application stats by params
 * @param _
 * @param args
 */
const getApplicationStatsByParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { keywords } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationStatsByParams] keywords : ${
                keywords?.join?.(',') || ''
            }`,
        );

        const appsStats = await ApplicationProvider.getApplicationStatsByParams({
            keywords,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationStatsByParams] appsStats : ${appsStats?.length}`,
        );

        return appsStats;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationStatsByParams] error : ${error}`);
        return null;
    }
};

/**
 * Get application total by params
 * @param _
 * @param args
 */
const getApplicationTotalByParams = async (
    _: unknown,
    args: SearchQueryType,
    { user }: { user: AccountType },
) => {
    try {
        const { keywords, searchText } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] keywords : ${
                keywords?.join?.(',') || ''
            }`,
        );
        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] searchText : ${searchText}`,
        );

        const appsTotal = await ApplicationProvider.getApplicationTotalByParams(
            {
                searchText,
                keywords,
            },
            user,
        );

        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] apps Total : ${appsTotal}`,
        );

        return appsTotal;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationTotalByParams] error : ${error}`);
        return 0;
    }
};

/**
 * Get application audit history by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationAuditHistoryByParams = async (
    _: unknown,
    args: { _id: number; limit?: number; offset?: number },
    { user }: { user: AccountType },
) => {
    try {
        const { _id, limit, offset } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(
            `[ApplicationQueries - getApplicationAuditHistoryByParams] _id: ${_id}, limit: ${limit}, offset: ${offset}`,
        );

        const auditRuns = await AuditRunProvider.getAuditRunsByApplicationId(_id, limit, offset);

        AppLogger.info(
            `[ApplicationQueries - getApplicationAuditHistoryByParams] auditRuns count: ${auditRuns?.length}`,
        );

        return auditRuns;
    } catch (error) {
        AppLogger.error(
            `[ApplicationQueries - getApplicationAuditHistoryByParams] error: ${error}`,
        );
        return [];
    }
};

/**
 * Get application audit history count by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationAuditHistoryCountByParams = async (
    _: unknown,
    args: { _id: number },
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(
            `[ApplicationQueries - getApplicationAuditHistoryCountByParams] _id: ${_id}`,
        );

        const count = await AuditRunProvider.getAuditRunsCountByApplicationId(_id);

        AppLogger.info(
            `[ApplicationQueries - getApplicationAuditHistoryCountByParams] count: ${count}`,
        );

        return count;
    } catch (error) {
        AppLogger.error(
            `[ApplicationQueries - getApplicationAuditHistoryCountByParams] error: ${error}`,
        );
        return 0;
    }
};

/**
 * Get application latest audit run by params
 * @param _
 * @param args
 * @param user
 */
const getApplicationLatestAuditRunByParams = async (
    _: unknown,
    args: { _id: number },
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(_id)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(`[ApplicationQueries - getApplicationLatestAuditRunByParams] _id: ${_id}`);

        const auditRun = await AuditRunProvider.getLatestAuditRun(_id);

        AppLogger.info(
            `[ApplicationQueries - getApplicationLatestAuditRunByParams] auditRun: ${auditRun?._id}`,
        );

        return auditRun;
    } catch (error) {
        AppLogger.error(
            `[ApplicationQueries - getApplicationLatestAuditRunByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Get audit run details by params
 * @param _
 * @param args
 * @param user
 */
const getAuditRunDetailsByParams = async (
    _: unknown,
    args: { _id: number },
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[ApplicationQueries - getAuditRunDetailsByParams] _id: ${_id}`);

        const auditRun = await AuditRunProvider.getAuditRunById(_id);

        // Check authorization if audit run exists and user is not ADMIN/SUPERADMIN
        if (auditRun && !(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(auditRun.appId)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(
            `[ApplicationQueries - getAuditRunDetailsByParams] auditRun: ${auditRun?._id}`,
        );

        return auditRun;
    } catch (error) {
        AppLogger.error(`[ApplicationQueries - getAuditRunDetailsByParams] error: ${error}`);
        return null;
    }
};

const ApplicationQueries = {
    getApplicationDetailsInfoByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationAuditRunsByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationDetailsKeywordsByParams,
    getApplicationTotalByParams,
    getApplicationListByPageAndParams,
    getApplicationStatsByParams,
    getApplicationAuditHistoryByParams,
    getApplicationAuditHistoryCountByParams,
    getApplicationLatestAuditRunByParams,
    getAuditRunDetailsByParams,
};

export default ApplicationQueries;
