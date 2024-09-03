import { AppLogger, ApplicationProvider } from '@v6y/commons';

/**
 * Retrieves application details based on provided parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including `appId`.
 * @returns An object containing application details or an empty object on error.
 */
const getApplicationDetailsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getApplicationDetailsByParams] appId : ${appId}`);

        const appDetails = await ApplicationProvider.getApplicationDetailsByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getApplicationDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationDetailsByParams] error : ${error.message}`);
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

        AppLogger.info(`[AppQueries - getApplicationDetailsAuditReports] appId : ${appId}`);

        const auditsReports = await ApplicationProvider.getApplicationDetailsAuditReportsByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getApplicationDetailsAuditReports] auditsReports : ${auditsReports?.length}`,
        );

        return auditsReports;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationDetailsAuditReports] error : ${error.message}`);
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

        AppLogger.info(`[AppQueries - getApplicationDetailsEvolutionsByParams] appId : ${appId}`);

        const evolutions = await ApplicationProvider.getApplicationDetailsEvolutionsByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getApplicationDetailsEvolutionsByParams] evolutions : ${evolutions?.length}`,
        );

        return evolutions;
    } catch (error) {
        AppLogger.info(
            `[AppQueries - getApplicationDetailsEvolutionsByParams] error : ${error.message}`,
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

        AppLogger.info(`[AppQueries - getApplicationDetailsDependenciesByParams] appId : ${appId}`);

        const dependencies = await ApplicationProvider.getApplicationDetailsDependenciesByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getApplicationDetailsDependenciesByParams] dependencies : ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(
            `[AppQueries - getApplicationDetailsDependenciesByParams] error : ${error.message}`,
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

        AppLogger.info(`[AppQueries - getApplicationListByPageAndParams] start : ${start}`);
        AppLogger.info(`[AppQueries - getApplicationListByPageAndParams] offset : ${offset}`);
        AppLogger.info(`[AppQueries - getApplicationListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[AppQueries - getApplicationListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(
            `[AppQueries - getApplicationListByPageAndParams] searchText : ${searchText}`,
        );
        AppLogger.info(`[AppQueries - getApplicationListByPageAndParams] where : ${where}`);
        AppLogger.info(`[AppQueries - getApplicationListByPageAndParams] sort : ${sort}`);

        const appList = await ApplicationProvider.getApplicationListByPageAndParams({
            searchText,
            keywords,
            offset: offset || start,
            limit,
            where,
        });

        AppLogger.info(
            `[AppQueries - getApplicationListByPageAndParams] appList : ${appList?.length}`,
        );

        return appList;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationListByPageAndParams] error : ${error.message}`);
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
            `[AppQueries - getApplicationStatsByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );

        const appsStats = await ApplicationProvider.getApplicationStatsByParams({
            keywords,
        });

        AppLogger.info(
            `[AppQueries - getApplicationStatsByParams] appsStats : ${appsStats?.data?.length}`,
        );

        return appsStats;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationStatsByParams] error : ${error.message}`);
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
            `[AppQueries - getApplicationTotalByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(`[AppQueries - getApplicationTotalByParams] searchText : ${searchText}`);

        const appsTotal = await ApplicationProvider.getApplicationTotalByParams({
            searchText,
            keywords,
        });

        AppLogger.info(`[AppQueries - getApplicationTotalByParams] apps Total : ${appsTotal}`);

        return appsTotal;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationTotalByParams] error : ${error.message}`);
        return 0;
    }
};

const ApplicationQueries = {
    getApplicationDetailsByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationTotalByParams,
    getApplicationListByPageAndParams,
    getApplicationStatsByParams,
};

export default ApplicationQueries;
