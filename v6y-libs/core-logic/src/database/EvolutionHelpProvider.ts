import { defaultEvolutionHelpStatus } from '../config/EvolutionHelpConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import { EvolutionHelpInputType, EvolutionHelpType } from '../types/EvolutionHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const formatEvolutionHelpInput = (evolutionHelp: EvolutionHelpInputType) => ({
    category: evolutionHelp.category,
    title: evolutionHelp.title,
    description: evolutionHelp.description,
    status: evolutionHelp.status,
    links:
        evolutionHelp.links
            ?.map((link) => ({ label: 'More Information', value: link, description: '' }))
            ?.filter((item) => item?.value) ?? [],
});

const createEvolutionHelp = async (evolutionHelp: EvolutionHelpInputType) => {
    try {
        if (!evolutionHelp?.title?.length) return null;
        const data = formatEvolutionHelpInput(evolutionHelp);
        const created = await getPrismaClient().evolutionHelp.create({
            data: { ...data, links: data.links.length ? data.links : undefined },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.info('[EvolutionHelpProvider - createEvolutionHelp] error: ' + error);
        return null;
    }
};

const editEvolutionHelp = async (evolutionHelp: EvolutionHelpInputType) => {
    try {
        if (!evolutionHelp?._id || !evolutionHelp?.title?.length) return null;
        const data = formatEvolutionHelpInput(evolutionHelp);
        await getPrismaClient().evolutionHelp.update({
            where: { id: evolutionHelp._id },
            data: { ...data, links: data.links.length ? data.links : undefined },
        });
        return { _id: evolutionHelp._id };
    } catch (error) {
        AppLogger.info('[EvolutionHelpProvider - editEvolutionHelp] error: ' + error);
        return null;
    }
};

const deleteEvolutionHelp = async ({ _id }: EvolutionHelpType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().evolutionHelp.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.info('[EvolutionHelpProvider - deleteEvolutionHelp] error: ' + error);
        return null;
    }
};

const deleteEvolutionHelpList = async () => {
    try {
        await getPrismaClient().evolutionHelp.deleteMany();
        return true;
    } catch (error) {
        AppLogger.info('[EvolutionHelpProvider - deleteEvolutionHelpList] error: ' + error);
        return false;
    }
};

const getEvolutionHelpListByPageAndParams = async ({ start, limit }: SearchQueryType) => {
    try {
        const list = await getPrismaClient().evolutionHelp.findMany({
            skip: start ?? undefined,
            take: limit ?? undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.info(
            '[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] error: ' + error,
        );
        return [];
    }
};

const getEvolutionHelpDetailsByParams = async ({ _id, category }: EvolutionHelpType) => {
    try {
        const item = await getPrismaClient().evolutionHelp.findFirst({
            where: _id ? { id: _id } : { category },
        });
        if (!item) return null;
        return { ...item, _id: item.id };
    } catch (error) {
        AppLogger.info('[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] error: ' + error);
        return null;
    }
};

const initDefaultData = async () => {
    try {
        const count = await getPrismaClient().evolutionHelp.count();
        if (count > 0) return true;
        for (const evolutionHelp of defaultEvolutionHelpStatus) {
            await createEvolutionHelp(evolutionHelp);
        }
        return true;
    } catch (error) {
        AppLogger.info('[EvolutionHelpProvider - initDefaultData] error: ' + error);
        return false;
    }
};

const EvolutionHelpProvider = {
    initDefaultData,
    createEvolutionHelp,
    editEvolutionHelp,
    deleteEvolutionHelp,
    deleteEvolutionHelpList,
    getEvolutionHelpListByPageAndParams,
    getEvolutionHelpDetailsByParams,
};
export default EvolutionHelpProvider;
