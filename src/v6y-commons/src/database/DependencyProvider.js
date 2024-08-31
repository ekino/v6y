import {
    dependencies,
    dependencyRecommendedVersions,
    dependencyStatus,
} from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.js';
import DeprecatedDependencyProvider from './DeprecatedDependencyProvider.js';

const insertDependency = async (dependency) => {
    try {
        AppLogger.info(
            `[DependencyProvider - insertDependency] dependency title:  ${dependency?.title}`,
        );
        if (!dependency?.title?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - insertDependency] error:  ${error.message}`);
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
        AppLogger.info(`[DependencyProvider - insertDependencyList] error:  ${error.message}`);
    }
};

const deleteDependencyList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependencyList] error:  ${error.message}`);
    }
};

const getDependenciesByParams = async ({ appId }) => {
    try {
        // TODO: read from DB
        const dependenciesByParams = dependencies;
        if (!dependenciesByParams?.length) {
            return;
        }

        const dependencyList = [];

        for (const dependency of dependenciesByParams) {
            if (dependency.module?.appId !== appId) {
                continue;
            }

            const isDeprecated =
                await DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams({
                    name: dependency.name,
                });

            const isOutDated = false; // TODO: semver compare with bistro

            // deprecated, outdated or up-to-date
            let depStatus = dependencyStatus['up-to-date'];
            if (isDeprecated) {
                depStatus = dependencyStatus.deprecated;
            } else if (isOutDated) {
                depStatus = dependencyStatus.outdated;
            }

            const depStatusHelp =
                await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                    category: depStatus,
                });

            const depRecommendedVersion = dependencyRecommendedVersions[dependency.name] || '';

            dependencyList.push({
                ...dependency,
                status: depStatus,
                statusHelp: depStatusHelp,
                recommendedVersion: depRecommendedVersion,
            });
        }

        return dependencyList;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - getDependencyByParams] error:  ${error.message}`);
        return [];
    }
};

const DependencyProvider = {
    insertDependencyList,
    deleteDependencyList,
    getDependenciesByParams,
};

export default DependencyProvider;
