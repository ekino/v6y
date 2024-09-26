"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EvolutionHelpStatusConfig_1 = require("../config/EvolutionHelpStatusConfig");
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const EvolutionHelpModel_1 = require("./models/EvolutionHelpModel");
/**
 * Formats the input EvolutionHelp object to the format expected by the database
 * @param evolutionHelp
 */
const formatEvolutionHelpInput = (evolutionHelp) => ({
    _id: evolutionHelp._id,
    title: evolutionHelp.title,
    description: evolutionHelp.description,
    category: evolutionHelp.category,
    status: evolutionHelp.status,
    links: evolutionHelp.links
        ?.map((link) => ({
        label: 'More Information',
        value: link,
        description: '',
    }))
        ?.filter((item) => item?.value),
});
/**
 * Creates a new EvolutionHelp in the database
 * @param evolutionHelp
 */
const createEvolutionHelp = async (evolutionHelp) => {
    try {
        AppLogger_1.default.info(`[EvolutionHelpProvider - createEvolutionHelp] evolutionHelp title:  ${evolutionHelp?.title}`);
        if (!evolutionHelp?.title?.length) {
            return null;
        }
        const createdEvolutionHelp = await EvolutionHelpModel_1.EvolutionHelpModelType.create(formatEvolutionHelpInput(evolutionHelp));
        AppLogger_1.default.info(`[EvolutionHelpProvider - createEvolutionHelp] createdEvolutionHelp: ${createdEvolutionHelp?._id}`);
        return createdEvolutionHelp;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - createEvolutionHelp] error:  ${error}`);
        return null;
    }
};
/**
 * Edits an existing EvolutionHelp in the database
 * @param evolutionHelp
 */
const editEvolutionHelp = async (evolutionHelp) => {
    try {
        AppLogger_1.default.info(`[EvolutionHelpProvider - editEvolutionHelp] evolutionHelp id:  ${evolutionHelp?._id}`);
        AppLogger_1.default.info(`[EvolutionHelpProvider - editEvolutionHelp] evolutionHelp title:  ${evolutionHelp?.title}`);
        if (!evolutionHelp?._id || !evolutionHelp?.title?.length) {
            return null;
        }
        const editedEvolutionHelp = await EvolutionHelpModel_1.EvolutionHelpModelType.update(formatEvolutionHelpInput(evolutionHelp), {
            where: {
                _id: evolutionHelp?._id,
            },
        });
        AppLogger_1.default.info(`[EvolutionHelpProvider - editEvolutionHelp] editedEvolutionHelp: ${editedEvolutionHelp?.[0]}`);
        return {
            _id: evolutionHelp?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - editEvolutionHelp] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes an existing EvolutionHelp from the database
 * @param _id
 */
const deleteEvolutionHelp = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[EvolutionHelpProvider - deleteEvolutionHelp] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await EvolutionHelpModel_1.EvolutionHelpModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - deleteEvolutionHelp] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes all EvolutionHelps from the database
 */
const deleteEvolutionHelpList = async () => {
    try {
        await EvolutionHelpModel_1.EvolutionHelpModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - deleteEvolutionHelpList] error:  ${error}`);
        return false;
    }
};
/**
 * Retrieves a list of EvolutionHelps from the database based on the provided search parameters
 * @param start
 * @param limit
 * @param sort
 */
const getEvolutionHelpListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] start: ${start}`);
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] limit: ${limit}`);
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] sort: ${sort}`);
        // Construct the query options based on provided arguments
        const queryOptions = {};
        // Handle pagination
        if (start) {
            queryOptions.offset = start;
        }
        if (limit) {
            queryOptions.limit = limit;
        }
        const evolutionHelpList = await EvolutionHelpModel_1.EvolutionHelpModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] evolutionHelpList: ${evolutionHelpList?.length}`);
        return evolutionHelpList;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Retrieves the details of an EvolutionHelp based on the provided search parameters
 * @param _id
 * @param category
 */
const getEvolutionHelpDetailsByParams = async ({ _id, category }) => {
    try {
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] _id: ${_id}`);
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] category: ${category}`);
        const evolutionHelpDetails = _id
            ? (await EvolutionHelpModel_1.EvolutionHelpModelType.findOne({
                where: {
                    _id,
                },
            }))?.dataValues
            : (await EvolutionHelpModel_1.EvolutionHelpModelType.findOne({
                where: {
                    category,
                },
            }))?.dataValues;
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] evolutionHelpDetails _id: ${evolutionHelpDetails?._id}`);
        if (!evolutionHelpDetails?._id) {
            return null;
        }
        return evolutionHelpDetails;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] error: ${error}`);
        return null;
    }
};
/**
 * Initializes the default data for EvolutionHelps
 */
const initDefaultData = async () => {
    try {
        const evolutionHelpCount = await EvolutionHelpModel_1.EvolutionHelpModelType.count();
        AppLogger_1.default.info(`[EvolutionHelpProvider - initDefaultData] evolutionHelpCount:  ${evolutionHelpCount}`);
        if (evolutionHelpCount > 0) {
            return true;
        }
        for (const evolutionHelp of EvolutionHelpStatusConfig_1.defaultEvolutionHelpStatus) {
            await createEvolutionHelp(evolutionHelp);
        }
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[EvolutionHelpProvider - initDefaultData] error:  ${error}`);
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
exports.default = EvolutionHelpProvider;
