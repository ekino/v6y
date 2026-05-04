import { FindOptions } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { EvolutionType } from '../types/EvolutionType.ts';
import EvolutionHelpProvider from './EvolutionHelpProvider.ts';
import ModuleProvider from './ModuleProvider.ts';
import { EvolutionHelpModelType } from './models/EvolutionHelpModel.ts';
import { EvolutionModelType } from './models/EvolutionModel.ts';
import { ModuleModelType } from './models/ModuleModel.ts';

const shapeEvolution = (item: EvolutionModelType) => ({
    ...item.dataValues,
    module: (item as unknown as Record<string, { dataValues: unknown }>).module?.dataValues ?? null,
    evolutionHelp:
        (item as unknown as Record<string, { dataValues: unknown }>).evolutionHelp?.dataValues ??
        null,
});

/**
 * Creates a new Evolution in the database
 * @param evolution
 */
const createEvolution = async (evolution: EvolutionType) => {
    try {
        AppLogger.info(
            `[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`,
        );

        if (!evolution?.category?.length) {
            return null;
        }

        const moduleRecord = evolution.module
            ? await ModuleProvider.findOrCreateModule(evolution.module)
            : null;

        const evolutionHelp = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            category: evolution?.category,
        });

        const { module: _module, evolutionHelp: _evolutionHelp, ...evoFields } = evolution;

        const createdEvolution = await EvolutionModelType.create({
            ...evoFields,
            appId: evolution.module?.appId ?? evolution.appId,
            moduleId: moduleRecord?._id ?? undefined,
            evolutionHelpId: evolutionHelp?._id ?? undefined,
        });

        AppLogger.info(
            `[EvolutionProvider - createEvolution] createdEvolution: ${createdEvolution?._id}`,
        );

        return createdEvolution;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - createEvolution] error:  ${error}`);
        return null;
    }
};

/**
 * Inserts a list of Evolutions in the database
 * @param evolutionList
 */
const insertEvolutionList = async (evolutionList: EvolutionType[]) => {
    try {
        AppLogger.info(
            `[EvolutionProvider - insertEvolutionList] evolutionList:  ${evolutionList?.length}`,
        );
        if (!evolutionList?.length) {
            return null;
        }

        for (const evolution of evolutionList) {
            await createEvolution(evolution);
        }

        AppLogger.info(
            `[EvolutionProvider - insertEvolutionList] evolutionList list inserted successfully`,
        );
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - insertEvolutionList] error:  ${error}`);
    }
};

/**
 * Edits an existing Evolution in the database
 * @param evolution
 */
const editEvolution = async (evolution: EvolutionType) => {
    try {
        AppLogger.info(`[EvolutionProvider - editEvolution] evolution _id:  ${evolution?._id}`);
        AppLogger.info(
            `[EvolutionProvider - editEvolution] evolution category:  ${evolution?.category}`,
        );

        if (!evolution?._id || !evolution?.category?.length) {
            return null;
        }

        const { module: _module, evolutionHelp: _evolutionHelp, ...evoFields } = evolution;

        const editedEvolution = await EvolutionModelType.update(evoFields, {
            where: { _id: evolution._id },
        });

        AppLogger.info(
            `[EvolutionProvider - editEvolution] editedEvolution: ${editedEvolution?.[0]}`,
        );

        return { _id: evolution._id };
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - editEvolution] error:  ${error}`);
        return null;
    }
};

/**
 * Deletes an existing Evolution in the database
 * @param _id
 */
const deleteEvolution = async ({ _id }: EvolutionType) => {
    try {
        AppLogger.info(`[EvolutionProvider - deleteEvolution] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await EvolutionModelType.destroy({ where: { _id } });

        return { _id };
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolution] error:  ${error}`);
        return null;
    }
};

/**
 * Deletes all Evolutions for an application.
 * @param appId
 */
const deleteEvolutionListByAppId = async ({ appId }: { appId: number }) => {
    try {
        await EvolutionModelType.destroy({ where: { appId } });
        return true;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolutionListByAppId] error:  ${error}`);
        return false;
    }
};

/**
 * Fetches a list of Evolutions from the database
 * @param appId
 */
const getEvolutionListByPageAndParams = async ({ appId }: EvolutionType) => {
    try {
        AppLogger.info(`[EvolutionProvider - getEvolutionListByPageAndParams] appId: ${appId}`);

        const queryOptions: FindOptions = {
            include: [
                { model: ModuleModelType, as: 'module', required: false },
                { model: EvolutionHelpModelType, as: 'evolutionHelp', required: false },
            ],
        };

        if (appId) {
            queryOptions.where = { appId };
        }

        const evolutionList = await EvolutionModelType.findAll(queryOptions);
        AppLogger.info(
            `[EvolutionProvider - getEvolutionListByPageAndParams] evolutionList: ${evolutionList?.length}`,
        );

        return evolutionList?.map(shapeEvolution) || [];
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - getEvolutionListByPageAndParams] error:  ${error}`);
        return [];
    }
};

const deleteEvolutionList = async () => {
    try {
        await EvolutionModelType.destroy({ truncate: true });
        return true;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolutionList] error:  ${error}`);
        return false;
    }
};

const EvolutionProvider = {
    createEvolution,
    insertEvolutionList,
    editEvolution,
    deleteEvolution,
    deleteEvolutionList,
    deleteEvolutionListByAppId,
    getEvolutionListByPageAndParams,
};

export default EvolutionProvider;
