import { appList, stats } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';
import AuditsProvider from './AuditsProvider.js';
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

const deleteAppList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[AppProvider - deleteAppList] error:  ${error.message}`);
    }
};

const getAppDetailsInfosByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getAppDetailsInfosByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const appDetails = appList?.find((app) => app._id === appId);

        AppLogger.info(
            `[AppProvider - getAppDetailsInfosByParams] appDetails _id: ${appDetails?._id}`,
        );

        if (!appDetails?._id) {
            return null;
        }

        const appDetailsKeywords = await KeywordProvider.getKeywordsByParams({
            appId: appDetails?._id,
        });

        return {
            ...appDetails,
            keywords: appDetailsKeywords,
        };
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppDetailsInfosByParams] error: ${error.message}`);
        return {};
    }
};

const getAppDetailsEvolutionsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getAppDetailsEvolutionsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const appDetails = appList?.find((app) => app._id === appId);

        AppLogger.info(
            `[AppProvider - getAppDetailsEvolutionsByParams] appDetails _id: ${appDetails?._id}`,
        );

        if (!appDetails?._id || appDetails?._id !== appId) {
            return null;
        }

        const appDetailsKeywords = await KeywordProvider.getKeywordsByParams({
            appId: appDetails?._id,
        });

        if (!appDetailsKeywords?.length) {
            return null;
        }

        const appDetailsEvolutions = [];
        for (const keyword of appDetailsKeywords) {
            const appDetailsEvolution = await EvolutionProvider.getEvolutionByParams({
                evolutionId: keyword.evolutionId,
            });

            if (appDetailsEvolution?._id?.length > 0) {
                appDetailsEvolutions.push({
                    ...appDetailsEvolution,
                    modules: keyword?.apps?.filter((app) => app.appId === appDetails?._id),
                });
            }
        }

        AppLogger.info(
            `[AppProvider - getAppDetailsEvolutionsByParams] appDetailsEvolutions: ${appDetailsEvolutions?.length}`,
        );

        return appDetailsEvolutions;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppDetailsEvolutionsByParams] error: ${error.message}`);
        return {};
    }
};

const getAppDetailsDependenciesByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getAppDetailsDependenciesByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const dependencies = await DependenciesProvider.getDependenciesByParams({
            appId,
        });

        AppLogger.info(
            `[AppProvider - getAppDetailsDependenciesByParams] dependencies: ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppDetailsDependenciesByParams] error: ${error.message}`);
        return {};
    }
};

const getAppDetailsAuditReportsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getAppDetailsAuditReportsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        return AuditsProvider.getAuditsByParams({ appId });
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppDetailsAuditReportsByParams] error: ${error.message}`);
        return {};
    }
};

const getAppsByParams = async ({ keywords, searchText, offset = 0, limit }) => {
    try {
        AppLogger.info(`[AppProvider - getAppsByParams] keywords: ${keywords?.join('\r\n')}`);
        AppLogger.info(`[AppProvider - getAppsByParams] searchText: ${searchText}`);
        AppLogger.info(`[AppProvider - getAppsByParams] offset: ${offset}`);
        AppLogger.info(`[AppProvider - getAppsByParams] limit: ${limit}`);

        // read from DB

        const dataSource = [];
        if (appList?.length) {
            for (const app of appList) {
                const { _id } = app;
                const appDetails = await getAppDetailsInfosByParams({ appId: _id });

                // eslint-disable-next-line max-depth
                if (appDetails?._id) {
                    dataSource.push(appDetails);
                }
            }
        }

        return limit ? dataSource.slice(offset, offset + limit) : dataSource;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppsByParams] error: ${error.message}`);
        return [];
    }
};

const getAppsTotalByParams = async ({ searchText, keywords }) => {
    try {
        AppLogger.info(`[AppProvider - getAppsTotalByParams] searchText: ${searchText}`);
        AppLogger.info(`[AppProvider - getAppsTotalByParams] keywords: ${keywords?.join('\r\n')}`);

        const apps = await getAppsByParams({ keywords, searchText });

        AppLogger.info(`[AppProvider - getAppsTotalByParams] apps total: ${apps?.length}`);

        return apps?.length;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppsTotalByParams] error: ${error.message}`);
        return 0;
    }
};

const getAppsStatsByParams = async ({ keywords }) => {
    try {
        AppLogger.info(`[AppProvider - getAppsStatsByParams] keywords: ${keywords?.join('\r\n')}`);

        // number of apps with each keyword
        // case of empty keyword

        return stats;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppsStatsByParams] error: ${error.message}`);
        return {};
    }
};

const AppProvider = {
    insertApp,
    getAppDetailsInfosByParams,
    getAppDetailsEvolutionsByParams,
    getAppDetailsDependenciesByParams,
    getAppDetailsAuditReportsByParams,
    getAppsByParams,
    getAppsTotalByParams,
    getAppsStatsByParams,
    deleteAppList,
};

export default AppProvider;
