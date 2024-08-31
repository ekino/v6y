import { deprecatedDependencies } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertDeprecatedDependency = async (dependency) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - insertDeprecatedDependency] error:  ${error.message}`,
        );
        return {};
    }
};

const insertDeprecatedDependencyList = async (deprecatedDependencyList) => {
    try {
        if (!deprecatedDependencyList?.length) {
            return;
        }

        for (const dependency of deprecatedDependencyList) {
            await insertDeprecatedDependency(dependency);
        }
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - insertDeprecatedDependencyList] error:  ${error.message}`,
        );
    }
};

const deleteDeprecatedDependencyList = async () => {
    try {
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - deleteDeprecatedDependencyList] error:  ${error.message}`,
        );
    }
};

const getDeprecatedDependencyDetailsByParams = async ({ deprecatedDependencyId, name }) => {
    try {
        AppLogger.info(
            `[DependencyProvider - getDeprecatedDependencyDetailsByParams] name: ${name}`,
        );

        if (name?.length) {
            return deprecatedDependencies.find(
                (deprecatedDependency) => deprecatedDependency?.name === name,
            );
        }

        if (deprecatedDependencyId?.length) {
            return deprecatedDependencies.find(
                (deprecatedDependency) => deprecatedDependency?._id === deprecatedDependencyId,
            );
        }

        return {};
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] error:  ${error.message}`,
        );
        return {};
    }
};

const getDeprecatedDependencyListByPageAndParams = async (_, args) => {
    try {
        const { start, limit, where, sort } = args || {};

        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] where : ${where}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] sort : ${sort}`,
        );

        return deprecatedDependencies;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

const DeprecatedDependencyProvider = {
    insertDeprecatedDependencyList,
    deleteDeprecatedDependencyList,
    getDeprecatedDependencyDetailsByParams,
    getDeprecatedDependencyListByPageAndParams,
};

export default DeprecatedDependencyProvider;
