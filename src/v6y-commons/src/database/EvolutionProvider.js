"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const EvolutionHelpProvider_1 = __importDefault(require("./EvolutionHelpProvider"));
const EvolutionModel_1 = require("./models/EvolutionModel");
/**
 * Creates a new Evolution in the database
 * @param evolution
 */
const createEvolution = async (evolution) => {
    try {
        AppLogger_1.default.info(`[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`);
        if (!evolution?.category?.length) {
            return null;
        }
        const evolutionHelp = await EvolutionHelpProvider_1.default.getEvolutionHelpDetailsByParams({
            category: evolution?.category,
        });
        const createdEvolution = await EvolutionModel_1.EvolutionModelType.create({
            ...evolution,
            appId: evolution.module?.appId,
            evolutionHelp,
        });
        AppLogger_1.default.info(`[EvolutionProvider - createEvolution] createdEvolution: ${createdEvolution?._id}`);
        return createdEvolution;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionProvider - createEvolution] error:  ${error}`);
        return null;
    }
};
/**
 * Inserts a list of Evolutions in the database
 * @param evolutionList
 */
const insertEvolutionList = async (evolutionList) => {
    try {
        AppLogger_1.default.info(`[EvolutionProvider - insertEvolutionList] evolutionList:  ${evolutionList?.length}`);
        if (!evolutionList?.length) {
            return null;
        }
        for (const evolution of evolutionList) {
            await createEvolution(evolution);
        }
        AppLogger_1.default.info(`[EvolutionProvider - insertEvolutionList] evolutionList list inserted successfully`);
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionProvider - insertEvolutionList] error:  ${error}`);
    }
};
/**
 * Edits an existing Evolution in the database
 * @param evolution
 */
const editEvolution = async (evolution) => {
    try {
        AppLogger_1.default.info(`[EvolutionProvider - createEvolution] evolution _id:  ${evolution?._id}`);
        AppLogger_1.default.info(`[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`);
        if (!evolution?._id || !evolution?.category?.length) {
            return null;
        }
        const editedEvolution = await EvolutionModel_1.EvolutionModelType.update(evolution, {
            where: {
                _id: evolution?._id,
            },
        });
        AppLogger_1.default.info(`[EvolutionProvider - editEvolution] editedEvolution: ${editedEvolution?.[0]}`);
        return {
            _id: evolution?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionProvider - editEvolution] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes an existing Evolution in the database
 * @param _id
 */
const deleteEvolution = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[EvolutionProvider - deleteEvolution] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await EvolutionModel_1.EvolutionModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionProvider - deleteEvolution] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes all Evolutions in the database
 */
const deleteEvolutionList = async () => {
    try {
        await EvolutionModel_1.EvolutionModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionProvider - deleteEvolutionList] error:  ${error}`);
        return false;
    }
};
/**
 * Fetches a list of Evolutions from the database
 * @param appId
 */
const getEvolutionListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger_1.default.info(`[EvolutionProvider - getEvolutionListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const evolutionList = await EvolutionModel_1.EvolutionModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[EvolutionProvider - getEvolutionListByPageAndParams] evolutionList: ${evolutionList?.length}`);
        return evolutionList;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionProvider - getEvolutionListByPageAndParams] error:  ${error}`);
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
exports.default = EvolutionProvider;
