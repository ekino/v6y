import { appList } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';
import AuditProvider from './AuditProvider.js';
import DependenciesProvider from './DependencyProvider.js';
import EvolutionProvider from './EvolutionProvider.js';
import KeywordProvider from './KeywordProvider.js';

const insertApp = async (app) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(`[AppProvider - insertApp] error: ${error.message}`);
        return null;
    }
};

const deleteApplicationList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[AppProvider - deleteApplicationList] error:  ${error.message}`);
    }
};

const getApplicationDetailsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getApplicationDetailsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const appDetails = appList?.find((app) => app._id === appId);

        AppLogger.info(
            `[AppProvider - getApplicationDetailsByParams] appDetails _id: ${appDetails?._id}`,
        );

        if (!appDetails?._id || appDetails?._id !== appId) {
            return null;
        }

        const appDetailsKeywords = await KeywordProvider.getKeywordListByParams({
            appId: appDetails?._id,
        });

        if (!appDetailsKeywords?.length) {
            return appDetails;
        }

        return {
            ...appDetails,
            keywords: appDetailsKeywords,
        };
    } catch (error) {
        AppLogger.info(`[AppProvider - getApplicationDetailsByParams] error: ${error.message}`);
        return {};
    }
};

const getApplicationDetailsEvolutionsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getApplicationDetailsEvolutionsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const appDetails = appList?.find((app) => app._id === appId);

        AppLogger.info(
            `[AppProvider - getApplicationDetailsEvolutionsByParams] appDetails _id: ${appDetails?._id}`,
        );

        if (!appDetails?._id || appDetails?._id !== appId) {
            return null;
        }

        const appDetailsEvolutions = await EvolutionProvider.getEvolutionsByParams({
            appId: appDetails?._id,
        });

        if (!appDetailsEvolutions) {
            return null;
        }

        return appDetailsEvolutions;
    } catch (error) {
        AppLogger.info(
            `[AppProvider - getApplicationDetailsEvolutionsByParams] error: ${error.message}`,
        );
        return {};
    }
};

const getApplicationDetailsDependenciesByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getApplicationDetailsDependenciesByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const dependencies = await DependenciesProvider.getDependenciesByParams({
            appId,
        });

        AppLogger.info(
            `[AppProvider - getApplicationDetailsDependenciesByParams] dependencies: ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(
            `[AppProvider - getApplicationDetailsDependenciesByParams] error: ${error.message}`,
        );
        return {};
    }
};

const getApplicationDetailsAuditReportsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getApplicationDetailsAuditReportsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        return AuditProvider.getAuditListByPageAndParams({ appId });
    } catch (error) {
        AppLogger.info(
            `[AppProvider - getApplicationDetailsAuditReportsByParams] error: ${error.message}`,
        );
        return {};
    }
};

const getApplicationListByPageAndParams = async ({
    searchText,
    keywords,
    offset,
    limit,
    where,
}) => {
    try {
        AppLogger.info(
            `[AppProvider - getApplicationListByPageAndParams] keywords: ${keywords?.join('\r\n')}`,
        );
        AppLogger.info(
            `[AppProvider - getApplicationListByPageAndParams] searchText: ${searchText}`,
        );
        AppLogger.info(`[AppProvider - getApplicationListByPageAndParams] where: ${where}`);
        AppLogger.info(`[AppProvider - getApplicationListByPageAndParams] offset: ${offset}`);
        AppLogger.info(`[AppProvider - getApplicationListByPageAndParams] limit: ${limit}`);

        // read from DB

        const dataSource = [];
        if (appList?.length) {
            for (const app of appList) {
                const { _id } = app;
                const appDetails = await getApplicationDetailsByParams({ appId: _id });

                // eslint-disable-next-line max-depth
                if (appDetails?._id) {
                    dataSource.push(appDetails);
                }
            }
        }

        return limit ? dataSource.slice(offset, offset + limit) : dataSource;
    } catch (error) {
        AppLogger.info(`[AppProvider - getApplicationListByPageAndParams] error: ${error.message}`);
        return [];
    }
};

const getApplicationTotalByParams = async ({ searchText, keywords }) => {
    try {
        AppLogger.info(`[AppProvider - getApplicationTotalByParams] searchText: ${searchText}`);
        AppLogger.info(
            `[AppProvider - getApplicationTotalByParams] keywords: ${keywords?.join('\r\n')}`,
        );

        const apps = await getApplicationListByPageAndParams({ keywords, searchText });

        AppLogger.info(`[AppProvider - getApplicationTotalByParams] apps total: ${apps?.length}`);

        return apps?.length;
    } catch (error) {
        AppLogger.info(`[AppProvider - getApplicationTotalByParams] error: ${error.message}`);
        return 0;
    }
};

const getApplicationStatsByParams = async ({ keywords }) => {
    try {
        AppLogger.info(
            `[AppProvider - getApplicationStatsByParams] keywords: ${keywords?.join('\r\n')}`,
        );

        // number of apps with each keyword
        // case of empty keyword

        return KeywordProvider.getKeywordsStatsByParams({ keywords });
    } catch (error) {
        AppLogger.info(`[AppProvider - getApplicationStatsByParams] error: ${error.message}`);
        return {};
    }
};

const AppProvider = {
    insertApp,
    getApplicationDetailsByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationListByPageAndParams,
    getApplicationTotalByParams,
    getApplicationStatsByParams,
    deleteApplicationList,
};

export default AppProvider;
