import { defaultDependencyStatusHelp } from '../config/DependencyHelpConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import {
    DependencyStatusHelpInputType,
    DependencyStatusHelpType,
} from '../types/DependencyStatusHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const formatInput = (d: DependencyStatusHelpInputType) => ({
    category: d.category!,
    title: d.title!,
    description: d.description,
    links:
        (d.links
            ?.map((link: string) => ({ label: 'More Information', value: link, description: '' }))
            ?.filter(
                (item) => item?.value,
            ) as unknown as import('@prisma/client').Prisma.InputJsonValue) ?? undefined,
});

const createDependencyStatusHelp = async (dependencyStatusHelp: DependencyStatusHelpInputType) => {
    try {
        if (!dependencyStatusHelp?.title?.length) return null;
        const data = formatInput(dependencyStatusHelp);
        const created = await getPrismaClient().dependencyStatusHelp.create({
            data: {
                category: data.category,
                title: data.title,
                description: data.description ?? null,
                links: data.links ?? undefined,
            },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.info(
            '[DependencyStatusHelpProvider - createDependencyStatusHelp] error: ' + error,
        );
        return null;
    }
};

const editDependencyStatusHelp = async (dependencyStatusHelp: DependencyStatusHelpInputType) => {
    try {
        if (!dependencyStatusHelp?._id || !dependencyStatusHelp?.title?.length) return null;
        const data = formatInput(dependencyStatusHelp);
        await getPrismaClient().dependencyStatusHelp.update({
            where: { id: dependencyStatusHelp._id },
            data: {
                category: data.category,
                title: data.title,
                description: data.description ?? null,
                links: data.links ?? undefined,
            },
        });
        return { _id: dependencyStatusHelp._id };
    } catch (error) {
        AppLogger.error('[DependencyStatusHelpProvider - editDependencyStatusHelp] error: ', error);
        return null;
    }
};

const deleteDependencyStatusHelp = async ({ _id }: DependencyStatusHelpType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().dependencyStatusHelp.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.info(
            '[DependencyStatusHelpProvider - deleteDependencyStatusHelp] error: ' + error,
        );
        return null;
    }
};

const deleteDependencyStatusHelpList = async () => {
    try {
        await getPrismaClient().dependencyStatusHelp.deleteMany();
        return true;
    } catch (error) {
        AppLogger.info(
            '[DependencyStatusHelpProvider - deleteDependencyStatusHelpList] error: ' + error,
        );
        return false;
    }
};

const getDependencyStatusHelpListByPageAndParams = async ({ start, limit }: SearchQueryType) => {
    try {
        const list = await getPrismaClient().dependencyStatusHelp.findMany({
            skip: start ?? undefined,
            take: limit ?? undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.info(
            '[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] error: ' +
                error,
        );
        return [];
    }
};

const getDependencyStatusHelpDetailsByParams = async ({
    _id,
    category,
}: DependencyStatusHelpType) => {
    try {
        const item = await getPrismaClient().dependencyStatusHelp.findFirst({
            where: _id ? { id: _id } : { category },
        });
        if (!item) return null;
        return { ...item, _id: item.id };
    } catch (error) {
        AppLogger.info(
            '[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] error: ' +
                error,
        );
        return null;
    }
};

const initDefaultData = async () => {
    try {
        const count = await getPrismaClient().dependencyStatusHelp.count();
        if (count > 0) return true;
        for (const d of defaultDependencyStatusHelp) {
            await createDependencyStatusHelp(d);
        }
        return true;
    } catch (error) {
        AppLogger.error('[DependencyStatusHelpProvider - initDefaultData] error: ', error);
        return false;
    }
};

const DependencyStatusHelpProvider = {
    initDefaultData,
    createDependencyStatusHelp,
    editDependencyStatusHelp,
    deleteDependencyStatusHelp,
    deleteDependencyStatusHelpList,
    getDependencyStatusHelpListByPageAndParams,
    getDependencyStatusHelpDetailsByParams,
};
export default DependencyStatusHelpProvider;
