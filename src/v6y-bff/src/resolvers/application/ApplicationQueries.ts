import { AppLogger, ApplicationProvider, ApplicationType, SearchQueryType } from '@v6y/commons';

/**
 * Get application details info by params
 * @param _
 * @param args
 */
const getApplicationDetailsInfoByParams = async (_: unknown, args: ApplicationType) => {
    try {
        const { _id } = args || {};

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
 */
const getApplicationDetailsAuditReportsByParams = async (_: unknown, args: ApplicationType) => {
    try {
        const { _id } = args || {};

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
 * Get application details evolutions by params
 * @param _
 * @param args
 */
const getApplicationDetailsEvolutionsByParams = async (_: unknown, args: ApplicationType) => {
    try {
        const { _id } = args || {};

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

const getApplicationDetailsDependenciesByParams = async (_: unknown, args: ApplicationType) => {
    try {
        const { _id } = args || {};

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
 */
const getApplicationDetailsKeywordsByParams = async (_: unknown, args: ApplicationType) => {
    try {
        const { _id } = args || {};

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
 */
const getApplicationListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { start, offset, limit, keywords, searchText, where, sort } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] start : ${start}`);
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] offset : ${offset}`,
        );
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] keywords : ${keywords?.join?.(',') || ''
            }`,
        );
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] searchText : ${searchText}`,
        );
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] where : ${where}`);
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] sort : ${sort}`);

        const appList = await ApplicationProvider.getApplicationListByPageAndParams({
            searchText,
            keywords,
            offset: offset !== undefined ? offset : start || 0,
            limit,
            where,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] appList : ${appList?.length}`,
        );

        return appList;
    } catch (error) {
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] error : ${error}`);
        return [];
    }
};

/**
 * Get application list
 * @param _
 * @param args
 */
const getApplicationList = async (_: unknown, args: SearchQueryType) => {
    try {
        const { where, sort } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] where : ${where}`);
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] sort : ${sort}`);

        const appList = await ApplicationProvider.getApplicationListByPageAndParams({
            where,
            sort,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] appList : ${appList?.length}`,
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
            `[ApplicationQueries - getApplicationStatsByParams] keywords : ${keywords?.join?.(',') || ''
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
const getApplicationTotalByParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { keywords, searchText } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] keywords : ${keywords?.join?.(',') || ''
            }`,
        );
        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] searchText : ${searchText}`,
        );

        const appsTotal = await ApplicationProvider.getApplicationTotalByParams({
            searchText,
            keywords,
        });

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
    getApplicationList,
    getApplicationStatsByParams,
};

export default ApplicationQueries;
