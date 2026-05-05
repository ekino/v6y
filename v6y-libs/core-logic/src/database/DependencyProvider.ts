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
                statusHelp: depStatusHelp ? JSON.parse(JSON.stringify(depStatusHelp)) : undefined,
                module: dependency.module
                    ? JSON.parse(JSON.stringify(dependency.module))
                    : undefined,
            },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.info('[DependencyProvider - createDependency] error: ' + error);
        return null;
    }
};

const insertDependencyList = async (dependencyList: DependencyType[]) => {
    try {
        if (!dependencyList?.length) return null;
        for (const dependency of dependencyList) {
            await createDependency(dependency);
        }
    } catch (error) {
        AppLogger.info('[DependencyProvider - insertDependencyList] error: ' + error);
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
        AppLogger.info('[DependencyProvider - editDependency] error: ' + error);
        return null;
    }
};

const deleteDependency = async ({ _id }: DependencyType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().dependency.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.info('[DependencyProvider - deleteDependency] error: ' + error);
        return null;
    }
};

const deleteDependencyList = async () => {
    try {
        await getPrismaClient().dependency.deleteMany();
        return true;
    } catch (error) {
        AppLogger.info('[DependencyProvider - deleteDependencyList] error: ' + error);
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
        AppLogger.info('[DependencyProvider - getDependencyListByPageAndParams] error: ' + error);
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
export default DependencyProvider;
