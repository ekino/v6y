import { AppLogger, AppProvider } from '@v6y/commons';

const getApplicationDetailsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getApplicationDetailsByParams] appId : ${appId}`);

        const appDetails = await AppProvider.getApplicationDetailsByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getApplicationDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationDetailsByParams] error : ${error.message}`);
        return {};
    }
};

const getApplicationDetailsAuditReportsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getApplicationDetailsAuditReports] appId : ${appId}`);

        const auditsReports = await AppProvider.getApplicationDetailsAuditReportsByParams({
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

const getApplicationDetailsEvolutionsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getApplicationDetailsEvolutionsByParams] appId : ${appId}`);

        const evolutions = await AppProvider.getApplicationDetailsEvolutionsByParams({
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

const getApplicationDetailsDependenciesByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getApplicationDetailsDependenciesByParams] appId : ${appId}`);

        const dependencies = await AppProvider.getApplicationDetailsDependenciesByParams({
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

        const appList = await AppProvider.getApplicationListByPageAndParams({
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

const getApplicationStatsByParams = async (_, args) => {
    try {
        const { keywords } = args || {};

        AppLogger.info(
            `[AppQueries - getApplicationStatsByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );

        const appsStats = await AppProvider.getApplicationStatsByParams({
            keywords,
        });

        AppLogger.info(
            `[AppQueries - getApplicationStatsByParams] appsStats : ${appsStats?.data?.length}`,
        );

        return appsStats;
    } catch (error) {
        AppLogger.info(`[AppQueries - getApplicationStatsByParams] error : ${error.message}`);
        return {};
    }
};

const getApplicationTotalByParams = async (_, args) => {
    try {
        const { keywords, searchText } = args || {};

        AppLogger.info(
            `[AppQueries - getApplicationTotalByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(`[AppQueries - getApplicationTotalByParams] searchText : ${searchText}`);

        const appsTotal = await AppProvider.getApplicationTotalByParams({
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

const AppQueries = {
    getApplicationDetailsByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationTotalByParams,
    getApplicationListByPageAndParams,
    getApplicationStatsByParams,
};

export default AppQueries;
