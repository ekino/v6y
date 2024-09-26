"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const DependencyStatusHelpProvider_1 = __importDefault(require("./DependencyStatusHelpProvider"));
const DependencyModel_1 = require("./models/DependencyModel");
/**
 * Create a new Dependency.
 * @param dependency
 */
const createDependency = async (dependency) => {
    try {
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency type:  ${dependency?.type}`);
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency name:  ${dependency?.name}`);
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency version:  ${dependency?.version}`);
        if (!dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length) {
            return null;
        }
        const depStatusHelp = await DependencyStatusHelpProvider_1.default.getDependencyStatusHelpDetailsByParams({
            category: dependency.status,
        });
        const createdDependency = await DependencyModel_1.DependencyModelType.create({
            ...dependency,
            appId: dependency.module?.appId,
            statusHelp: depStatusHelp,
        });
        AppLogger_1.default.info(`[DependencyProvider - createDependency] createdDependency: ${createdDependency?._id}`);
        return createdDependency;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyProvider - createDependency] error:  ${error}`);
        return null;
    }
};
/**
 * Insert a list of Dependencies.
 * @param dependencyList
 */
const insertDependencyList = async (dependencyList) => {
    try {
        AppLogger_1.default.info(`[DependencyProvider - insertDependencyList] dependencyList:  ${dependencyList?.length}`);
        if (!dependencyList?.length) {
            return null;
        }
        for (const dependency of dependencyList) {
            await createDependency(dependency);
        }
        AppLogger_1.default.info(`[DependencyProvider - insertDependencyList] dependencyList list inserted successfully`);
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyProvider - insertDependencyList] error:  ${error}`);
    }
};
/**
 * Edit a Dependency.
 * @param dependency
 */
const editDependency = async (dependency) => {
    try {
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency _id:  ${dependency?._id}`);
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency type:  ${dependency?.type}`);
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency name:  ${dependency?.name}`);
        AppLogger_1.default.info(`[DependencyProvider - createDependency] dependency version:  ${dependency?.version}`);
        if (!dependency?._id ||
            !dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length) {
            return null;
        }
        const editedDependency = await DependencyModel_1.DependencyModelType.update(dependency, {
            where: {
                _id: dependency?._id,
            },
        });
        AppLogger_1.default.info(`[DependencyProvider - editDependency] editedDependency: ${editedDependency?.[0]}`);
        return {
            _id: dependency?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyProvider - editDependency] error:  ${error}`);
        return null;
    }
};
/**
 * Delete a Dependency.
 * @param _id
 */
const deleteDependency = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[DependencyProvider - deleteDependency] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await DependencyModel_1.DependencyModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyProvider - deleteDependency] error:  ${error}`);
        return null;
    }
};
/**
 * Delete all Dependencies.
 */
const deleteDependencyList = async () => {
    try {
        await DependencyModel_1.DependencyModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyProvider - deleteDependencyList] error:  ${error}`);
        return false;
    }
};
/**
 * Get a list of Dependencies by page and params.
 * @param appId
 */
const getDependencyListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger_1.default.info(`[DependencyProvider - getDependencyListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const dependencyList = await DependencyModel_1.DependencyModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[DependencyProvider - getDependencyListByPageAndParams] dependencyList: ${dependencyList?.length}`);
        return dependencyList;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyProvider - getDependencyListByPageAndParams] error:  ${error}`);
        return [];
    }
};
const DependencyProvider = {
    createDependency,
    insertDependencyList,
    editDependency,
    deleteDependency,
    deleteDependencyList,
    getDependencyListByPageAndParams,
};
exports.default = DependencyProvider;
