import { Prisma } from '@prisma/client';

import AppLogger from '../core/AppLogger.ts';
import { DependencyType } from '../types/DependencyType.ts';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createDependency = async (dependency: DependencyType) => {
    try {
        if (!dependency?.type?.length || !dependency?.name?.length || !dependency?.version?.length)
            return null;

        const depStatusHelp =
            await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                category: dependency.status,
            });

        const created = await getPrismaClient().dependency.create({
            data: {
                appId: (dependency.module?.appId ?? dependency.appId)!,
                type: dependency.type ?? null,
                name: dependency.name ?? null,
                version: dependency.version ?? null,
                recommendedVersion: dependency.recommendedVersion ?? null,
                status: dependency.status ?? null,
                statusHelp: depStatusHelp
                    ? (depStatusHelp as unknown as Prisma.InputJsonValue)
                    : undefined,
                module: dependency.module
                    ? (dependency.module as unknown as Prisma.InputJsonValue)
                    : undefined,
            },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.error('[DependencyProvider - createDependency] error: ', error);
        return null;
    }
};

const insertDependencyList = async (dependencyList: DependencyType[]) => {
    try {
        if (!dependencyList?.length) return null;

        const records = (await Promise.all(
            dependencyList
                .filter((dep) => dep?.type?.length && dep?.name?.length && dep?.version?.length)
                .map(async (dependency) => {
                    const depStatusHelp =
                        await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                            category: dependency.status,
                        });
                    return {
                        appId: (dependency.module?.appId ?? dependency.appId)!,
                        type: dependency.type ?? null,
                        name: dependency.name ?? null,
                        version: dependency.version ?? null,
                        recommendedVersion: dependency.recommendedVersion ?? null,
                        status: dependency.status ?? null,
                        statusHelp: depStatusHelp
                            ? (depStatusHelp as unknown as Prisma.InputJsonValue)
                            : undefined,
                        module: dependency.module
                            ? (dependency.module as unknown as Prisma.InputJsonValue)
                            : undefined,
                    };
                }),
        )) as Prisma.DependencyCreateManyInput[];

        if (!records.length) return null;
        await getPrismaClient().dependency.createMany({ data: records, skipDuplicates: true });
    } catch (error) {
        AppLogger.error('[DependencyProvider - insertDependencyList] error: ', error);
    }
};

const editDependency = async (dependency: DependencyType) => {
    try {
        if (
            !dependency?._id ||
            !dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length
        )
            return null;
        await getPrismaClient().dependency.update({
            where: { id: dependency._id },
            data: {
                type: dependency.type ?? null,
                name: dependency.name ?? null,
                version: dependency.version ?? null,
                recommendedVersion: dependency.recommendedVersion ?? null,
                status: dependency.status ?? null,
            },
        });
        return { _id: dependency._id };
    } catch (error) {
        AppLogger.error('[DependencyProvider - editDependency] error: ', error);
        return null;
    }
};

const deleteDependency = async ({ _id }: DependencyType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().dependency.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.error('[DependencyProvider - deleteDependency] error: ', error);
        return null;
    }
};

/**
 * Delete all Dependencies for a given application.
 * @param appId
 */
const deleteDependenciesByAppId = async (appId: number) => {
    try {
        AppLogger.info(`[DependencyProvider - deleteDependenciesByAppId] appId:  ${appId}`);
        await getPrismaClient().dependency.deleteMany({
            where: { appId },
        });
        return true;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependenciesByAppId] error:  ${error}`);
        return false;
    }
};

const deleteDependencyList = async () => {
    try {
        await getPrismaClient().dependency.deleteMany();
        return true;
    } catch (error) {
        AppLogger.error('[DependencyProvider - deleteDependencyList] error: ', error);
        return false;
    }
};

const getDependencyListByPageAndParams = async ({ appId }: DependencyType) => {
    try {
        const list = await getPrismaClient().dependency.findMany({
            where: appId ? { appId } : undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.error('[DependencyProvider - getDependencyListByPageAndParams] error: ', error);
        return [];
    }
};

const DependencyProvider = {
    createDependency,
    insertDependencyList,
    editDependency,
    deleteDependency,
    deleteDependenciesByAppId,
    deleteDependencyList,
    getDependencyListByPageAndParams,
};
export default DependencyProvider;
