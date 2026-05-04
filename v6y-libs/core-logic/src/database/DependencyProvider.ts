import { FindOptions } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { DependencyType } from '../types/DependencyType.ts';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.ts';
import ModuleProvider from './ModuleProvider.ts';
import { DependencyModelType } from './models/DependencyModel.ts';
import { DependencyStatusHelpModelType } from './models/DependencyStatusHelpModel.ts';
import { ModuleModelType } from './models/ModuleModel.ts';

const shapeDependency = (item: DependencyModelType) => ({
    ...item.dataValues,
    module: (item as unknown as Record<string, { dataValues: unknown }>).module?.dataValues ?? null,
    statusHelp:
        (item as unknown as Record<string, { dataValues: unknown }>).statusHelp?.dataValues ?? null,
});

/**
 * Create a new Dependency.
 * @param dependency
 */
const createDependency = async (dependency: DependencyType) => {
    try {
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency type:  ${dependency?.type}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency name:  ${dependency?.name}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency version:  ${dependency?.version}`,
        );

        if (
            !dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length
        ) {
            return null;
        }

        const moduleRecord = dependency.module
            ? await ModuleProvider.findOrCreateModule(dependency.module)
            : null;

        const depStatusHelp =
            await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                category: dependency.status,
            });

        const { module: _module, statusHelp: _statusHelp, ...depFields } = dependency;

        const createdDependency = await DependencyModelType.create({
            ...depFields,
            appId: dependency.module?.appId ?? dependency.appId,
            moduleId: moduleRecord?._id ?? undefined,
            statusHelpId: depStatusHelp?._id ?? undefined,
        });

        AppLogger.info(
            `[DependencyProvider - createDependency] createdDependency: ${createdDependency?._id}`,
        );

        return createdDependency;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - createDependency] error:  ${error}`);
        return null;
    }
};

/**
 * Insert a list of Dependencies.
 * @param dependencyList
 */
const insertDependencyList = async (dependencyList: DependencyType[]) => {
    try {
        AppLogger.info(
            `[DependencyProvider - insertDependencyList] dependencyList:  ${dependencyList?.length}`,
        );
        if (!dependencyList?.length) {
            return null;
        }

        for (const dependency of dependencyList) {
            await createDependency(dependency);
        }

        AppLogger.info(
            `[DependencyProvider - insertDependencyList] dependencyList list inserted successfully`,
        );
    } catch (error) {
        AppLogger.info(`[DependencyProvider - insertDependencyList] error:  ${error}`);
    }
};

/**
 * Edit a Dependency.
 * @param dependency
 */
const editDependency = async (dependency: DependencyType) => {
    try {
        AppLogger.info(`[DependencyProvider - editDependency] dependency _id:  ${dependency?._id}`);
        AppLogger.info(
            `[DependencyProvider - editDependency] dependency type:  ${dependency?.type}`,
        );
        AppLogger.info(
            `[DependencyProvider - editDependency] dependency name:  ${dependency?.name}`,
        );
        AppLogger.info(
            `[DependencyProvider - editDependency] dependency version:  ${dependency?.version}`,
        );

        if (
            !dependency?._id ||
            !dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length
        ) {
            return null;
        }

        const { module: _module, statusHelp: _statusHelp, ...depFields } = dependency;

        const editedDependency = await DependencyModelType.update(depFields, {
            where: { _id: dependency._id },
        });

        AppLogger.info(
            `[DependencyProvider - editDependency] editedDependency: ${editedDependency?.[0]}`,
        );

        return { _id: dependency._id };
    } catch (error) {
        AppLogger.info(`[DependencyProvider - editDependency] error:  ${error}`);
        return null;
    }
};

/**
 * Delete a Dependency.
 * @param _id
 */
const deleteDependency = async ({ _id }: DependencyType) => {
    try {
        AppLogger.info(`[DependencyProvider - deleteDependency] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await DependencyModelType.destroy({ where: { _id } });

        return { _id };
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependency] error:  ${error}`);
        return null;
    }
};

/**
 * Delete all Dependencies for an application.
 * @param appId
 */
const deleteDependencyListByAppId = async ({ appId }: { appId: number }) => {
    try {
        await DependencyModelType.destroy({ where: { appId } });
        return true;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependencyListByAppId] error:  ${error}`);
        return false;
    }
};

/**
 * Get a list of Dependencies by page and params.
 * @param appId
 */
const getDependencyListByPageAndParams = async ({ appId }: DependencyType) => {
    try {
        AppLogger.info(`[DependencyProvider - getDependencyListByPageAndParams] appId: ${appId}`);

        const queryOptions: FindOptions = {
            include: [
                { model: ModuleModelType, as: 'module', required: false },
                { model: DependencyStatusHelpModelType, as: 'statusHelp', required: false },
            ],
        };

        if (appId) {
            queryOptions.where = { appId };
        }

        const dependencyList = await DependencyModelType.findAll(queryOptions);
        AppLogger.info(
            `[DependencyProvider - getDependencyListByPageAndParams] dependencyList: ${dependencyList?.length}`,
        );

        return dependencyList?.map(shapeDependency) || [];
    } catch (error) {
        AppLogger.info(`[DependencyProvider - getDependencyListByPageAndParams] error:  ${error}`);
        return [];
    }
};

const deleteDependencyList = async () => {
    try {
        await DependencyModelType.destroy({ truncate: true });
        return true;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependencyList] error:  ${error}`);
        return false;
    }
};

const DependencyProvider = {
    createDependency,
    insertDependencyList,
    editDependency,
    deleteDependency,
    deleteDependencyList,
    deleteDependencyListByAppId,
    getDependencyListByPageAndParams,
};

export default DependencyProvider;
