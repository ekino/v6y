import {
    AccountType,
    AppLogger,
    ApplicationProvider,
    ApplicationType,
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

        if (auditsReports && auditsReports.length > 0) {
            AppLogger.info(
                `[ApplicationQueries - getApplicationDetailsAuditReports] First audit:`,
                JSON.stringify(auditsReports[0]),
            );
        } else {
            AppLogger.warn(
                `[ApplicationQueries - getApplicationDetailsAuditReports] No audit reports found for appId: ${_id}`,
            );
        }

        return auditsReports;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationDetailsAuditReports] error : ${error}`);
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

const ApplicationQueries = {
    getApplicationDetailsInfoByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationDetailsKeywordsByParams,
    getApplicationTotalByParams,
    getApplicationListByPageAndParams,
    getApplicationStatsByParams,
};

export default ApplicationQueries;
