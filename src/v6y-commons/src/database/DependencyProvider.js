import {
    DEPENDENCIES_STATUS,
    dependencies,
    dependencyStatusHelp,
    frontendDeprecatedDeps,
    frontendDepsMinVersions,
} from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertDependency = async (dependency) => {
    try {
        AppLogger.info(`[insertDependency] dependency title:  ${dependency?.title}`);
        if (!dependency?.title?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[insertDependency] error:  ${error.message}`);
        return {};
    }
};

const insertDependencyList = async (dependencyList) => {
    try {
        if (!dependencyList?.length) {
            return;
        }

        for (const dependency of dependencyList) {
            await insertDependency(dependency);
        }
    } catch (error) {
        AppLogger.info(`[insertDependencyList] error:  ${error.message}`);
    }
};

const deleteDependencyList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteDependencyList] error:  ${error.message}`);
    }
};

const getDependenciesByParams = async ({ appId }) => {
    try {
        // TODO: read from DB

        return dependencies
            ?.filter((item) => item.appId === appId)
            ?.map((dependency) => {
                const isDeprecated = frontendDeprecatedDeps.includes(dependency.name);
                const isOutDated = false; // TODO: semver compare

                // deprecated, outdated or up-to-date
                let depStatus = DEPENDENCIES_STATUS['up-to-date'];
                if (isDeprecated) {
                    depStatus = DEPENDENCIES_STATUS.deprecated;
                } else if (isOutDated) {
                    depStatus = DEPENDENCIES_STATUS.outdated;
                }

                const depStatusHelp = dependencyStatusHelp[depStatus] || {};
                const depRecommendedVersion = frontendDepsMinVersions[dependency.name] || '';

                return {
                    ...dependency,
                    status: depStatus,
                    help: {
                        ...depStatusHelp,
                        description: depStatusHelp.description
                            ?.replaceAll('XXX', dependency.name)
                            ?.replaceAll('YYY', depRecommendedVersion),
                    },
                    recommendedVersion: depRecommendedVersion,
                };
            });
    } catch (error) {
        AppLogger.info(`[getDependencyByParams] error:  ${error.message}`);
        return [];
    }
};

const DependencyProvider = {
    insertDependencyList,
    deleteDependencyList,
    getDependenciesByParams,
};

export default DependencyProvider;
