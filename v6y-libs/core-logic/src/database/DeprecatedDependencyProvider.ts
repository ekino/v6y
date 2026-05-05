import AppLogger from '../core/AppLogger.ts';
import { DeprecatedDependencyType } from '../types/DeprecatedDependencyType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createDeprecatedDependency = async (deprecatedDependency: DeprecatedDependencyType) => {
    try {
        if (!deprecatedDependency?.name?.length) return null;
        const created = await getPrismaClient().deprecatedDependency.create({
            data: { name: deprecatedDependency.name },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.info(
            '[DeprecatedDependencyProvider - createDeprecatedDependency] error: ' + error,
        );
        return null;
    }
};

const editDeprecatedDependency = async (deprecatedDependency: DeprecatedDependencyType) => {
    try {
        if (!deprecatedDependency?._id || !deprecatedDependency?.name?.length) return null;
        await getPrismaClient().deprecatedDependency.update({
            where: { id: deprecatedDependency._id },
            data: { name: deprecatedDependency.name },
        });
        return { _id: deprecatedDependency._id };
    } catch (error) {
        AppLogger.info('[DeprecatedDependencyProvider - editDeprecatedDependency] error: ' + error);
        return null;
    }
};

const deleteDeprecatedDependency = async ({ _id }: DeprecatedDependencyType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().deprecatedDependency.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.info(
            '[DeprecatedDependencyProvider - deleteDeprecatedDependency] error: ' + error,
        );
        return null;
    }
};

const deleteDeprecatedDependencyList = async () => {
    try {
        await getPrismaClient().deprecatedDependency.deleteMany();
        return true;
    } catch (error) {
        AppLogger.info(
            '[DeprecatedDependencyProvider - deleteDeprecatedDependencyList] error: ' + error,
        );
        return false;
    }
};

const getDeprecatedDependencyListByPageAndParams = async ({ start, limit }: SearchQueryType) => {
    try {
        const list = await getPrismaClient().deprecatedDependency.findMany({
            skip: start ?? undefined,
            take: limit ?? undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.info(
            '[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] error: ' +
                error,
        );
        return [];
    }
};

const getDeprecatedDependencyDetailsByParams = async ({ _id, name }: DeprecatedDependencyType) => {
    try {
        const item = await getPrismaClient().deprecatedDependency.findFirst({
            where: _id ? { id: _id } : { name },
        });
        if (!item) return null;
        return { ...item, _id: item.id };
    } catch (error) {
        AppLogger.info(
            '[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] error: ' +
                error,
        );
        return null;
    }
};

const DeprecatedDependencyProvider = {
    createDeprecatedDependency,
    editDeprecatedDependency,
    deleteDeprecatedDependency,
    deleteDeprecatedDependencyList,
    getDeprecatedDependencyListByPageAndParams,
    getDeprecatedDependencyDetailsByParams,
};
export default DeprecatedDependencyProvider;
