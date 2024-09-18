import { AppLogger, ApplicationProvider } from '@v6y/commons';

/**
 * Retrieves application details info based on provided parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `appId`.
 * @returns An object containing application details or an empty object on error.
 */
const getApplicationDetailsInfoByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationDetailsInfoByParams] appId : ${appId}`);

        const appDetails = await ApplicationProvider.getApplicationDetailsInfoByParams({
            appId,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsInfoByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsInfoByParams] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Fetches audit reports for an application based on provided parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `appId`.
 * @returns An array of audit reports or an empty array on error.
 */
const getApplicationDetailsAuditReportsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationDetailsAuditReports] appId : ${appId}`);

        const auditsReports = await ApplicationProvider.getApplicationDetailsAuditReportsByParams({
            appId,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsAuditReports] auditsReports : ${auditsReports?.length}`,
        );

        return auditsReports;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsAuditReports] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves application evolutions (changes/updates) based on provided parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `appId`.
 * @returns An array of application evolutions or an empty array on error
 */
const getApplicationDetailsEvolutionsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsEvolutionsByParams] appId : ${appId}`,
        );

        const evolutions = await ApplicationProvider.getApplicationDetailsEvolutionsByParams({
            appId,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsEvolutionsByParams] evolutions : ${evolutions?.length}`,
        );

        return evolutions;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsEvolutionsByParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Fetches application dependencies based on provided parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `appId`.
 * @returns An array of application dependencies or an empty array on error.
 */
const getApplicationDetailsDependenciesByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsDependenciesByParams] appId : ${appId}`,
        );

        const dependencies = await ApplicationProvider.getApplicationDetailsDependenciesByParams({
            appId,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsDependenciesByParams] dependencies : ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsDependenciesByParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Fetches application keywords based on provided parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `appId`.
 * @returns {Promise<Array|null|*[]>}
 */
const getApplicationDetailsKeywordsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsKeywordsByParams] appId : ${appId}`,
        );

        const keywords = await ApplicationProvider.getApplicationDetailsKeywordsByParams({
            appId,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsKeywordsByParams] keywords : ${keywords?.length}`,
        );

        return keywords;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationDetailsKeywordsByParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves a list of applications based on pagination and filtering parameters
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments including pagination, filtering, and sorting options
 * @returns An array of applications matching the criteria, or an empty array on error.
 */
const getApplicationListByPageAndParams = async (_, args) => {
    try {
        const { start, offset, limit, keywords, searchText, where, sort } = args || {};

        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] start : ${start}`);
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] offset : ${offset}`,
        );
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] searchText : ${searchText}`,
        );
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] where : ${where}`);
        AppLogger.info(`[ApplicationQueries - getApplicationListByPageAndParams] sort : ${sort}`);

        const appList = await ApplicationProvider.getApplicationListByPageAndParams({
            searchText,
            keywords,
            offset: offset || start,
            limit,
            where,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] appList : ${appList?.length}`,
        );

        return appList;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Fetches application statistics based on provided parameters
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `keywords`.
 * @returns An object containing application statistics or an empty object on error
 */
const getApplicationStatsByParams = async (_, args) => {
    try {
        const { keywords } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationStatsByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );

        const appsStats = await ApplicationProvider.getApplicationStatsByParams({
            keywords,
        });

        AppLogger.info(
            `[ApplicationQueries - getApplicationStatsByParams] appsStats : ${appsStats?.data?.length}`,
        );

        return appsStats;
    } catch (error) {
        AppLogger.info(
            `[ApplicationQueries - getApplicationStatsByParams] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Retrieves the total number of applications based on provided parameters
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including 'keywords' and 'searchText'.
 * @returns The total count of applications or 0 on error.
 */
const getApplicationTotalByParams = async (_, args) => {
    try {
        const { keywords, searchText } = args || {};

        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] keywords : ${keywords?.join?.(',') || ''}`,
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
        AppLogger.info(
            `[ApplicationQueries - getApplicationTotalByParams] error : ${error.message}`,
        );
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
