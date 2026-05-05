import AppLogger from '../core/AppLogger.ts';
import { EvolutionType } from '../types/EvolutionType.ts';
import EvolutionHelpProvider from './EvolutionHelpProvider.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createEvolution = async (evolution: EvolutionType) => {
    try {
        if (!evolution?.category?.length) return null;

        const evolutionHelp = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            category: evolution?.category,
        });

        const created = await getPrismaClient().evolution.create({
            data: {
                appId: (evolution.module?.appId ?? evolution.appId)!,
                category: evolution.category,
                evolutionHelp: evolutionHelp
                    ? JSON.parse(JSON.stringify(evolutionHelp))
                    : undefined,
                module: evolution.module ? JSON.parse(JSON.stringify(evolution.module)) : undefined,
            },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.info('[EvolutionProvider - createEvolution] error: ' + error);
        return null;
    }
};

const insertEvolutionList = async (evolutionList: EvolutionType[]) => {
    try {
        if (!evolutionList?.length) return null;
        for (const evolution of evolutionList) {
            await createEvolution(evolution);
        }
    } catch (error) {
        AppLogger.info('[EvolutionProvider - insertEvolutionList] error: ' + error);
    }
};

const editEvolution = async (evolution: EvolutionType) => {
    try {
        if (!evolution?._id || !evolution?.category?.length) return null;
        await getPrismaClient().evolution.update({
            where: { id: evolution._id },
            data: { category: evolution.category },
        });
        return { _id: evolution._id };
    } catch (error) {
        AppLogger.info('[EvolutionProvider - editEvolution] error: ' + error);
        return null;
    }
};

const deleteEvolution = async ({ _id }: EvolutionType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().evolution.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.info('[EvolutionProvider - deleteEvolution] error: ' + error);
        return null;
    }
};

const deleteEvolutionList = async () => {
    try {
        await getPrismaClient().evolution.deleteMany();
        return true;
    } catch (error) {
        AppLogger.info('[EvolutionProvider - deleteEvolutionList] error: ' + error);
        return false;
    }
};

const getEvolutionListByPageAndParams = async ({ appId }: EvolutionType) => {
    try {
        const list = await getPrismaClient().evolution.findMany({
            where: appId ? { appId } : undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.info('[EvolutionProvider - getEvolutionListByPageAndParams] error: ' + error);
        return [];
    }
};

const EvolutionProvider = {
    createEvolution,
    insertEvolutionList,
    editEvolution,
    deleteEvolution,
    deleteEvolutionList,
    getEvolutionListByPageAndParams,
};
export default EvolutionProvider;
