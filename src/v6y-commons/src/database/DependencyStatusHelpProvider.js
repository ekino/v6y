"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DependencyStatusHelpConfig_1 = require("../config/DependencyStatusHelpConfig");
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const DependencyStatusHelpModel_1 = require("./models/DependencyStatusHelpModel");
/**
 * Format the dependency status help input
 * @param dependencyStatusHelp
 */
const formatDependencyStatusHelpInput = (dependencyStatusHelp) => ({
    _id: dependencyStatusHelp?._id,
    title: dependencyStatusHelp.title,
    description: dependencyStatusHelp.description,
    category: dependencyStatusHelp.category,
    links: dependencyStatusHelp.links
        ?.map((link) => ({
        label: 'More Information',
        value: link,
        description: '',
    }))
        ?.filter((item) => item?.value),
});
/**
 * Create a new dependency status help
 * @param dependencyStatusHelp
 */
const createDependencyStatusHelp = async (dependencyStatusHelp) => {
    try {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - createDependencyStatusHelp] dependencyStatusHelp title:  ${dependencyStatusHelp?.title}`);
        if (!dependencyStatusHelp?.title?.length) {
            return null;
        }
        const createdDependencyStatusHelp = await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.create(formatDependencyStatusHelpInput(dependencyStatusHelp));
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - createDependencyStatusHelp] createdDependencyStatusHelp: ${createdDependencyStatusHelp?._id}`);
        return createdDependencyStatusHelp;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - createDependencyStatusHelp] error:  ${error}`);
        return null;
    }
};
/**
 * Edit an existing dependency status help
 * @param dependencyStatusHelp
 */
const editDependencyStatusHelp = async (dependencyStatusHelp) => {
    try {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - editDependencyStatusHelp] dependencyStatusHelp id:  ${dependencyStatusHelp?._id}`);
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - editDependencyStatusHelp] dependencyStatusHelp title:  ${dependencyStatusHelp?.title}`);
        if (!dependencyStatusHelp?._id || !dependencyStatusHelp?.title?.length) {
            return null;
        }
        const editedDependencyStatusHelp = await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.update(formatDependencyStatusHelpInput(dependencyStatusHelp), {
            where: {
                _id: dependencyStatusHelp?._id,
            },
        });
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - editDependencyStatusHelp] editedDependencyStatusHelp: ${editedDependencyStatusHelp?.[0]}`);
        return {
            _id: dependencyStatusHelp?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - editDependencyStatusHelp] error:  ${error}`);
        return null;
    }
};
/**
 * Delete a dependency status help
 * @param _id
 */
const deleteDependencyStatusHelp = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - deleteDependencyStatusHelp] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - deleteDependencyStatusHelp] error:  ${error}`);
        return null;
    }
};
/**
 * Delete all dependency status help
 */
const deleteDependencyStatusHelpList = async () => {
    try {
        await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - deleteDependencyStatusHelpList] error:  ${error}`);
        return false;
    }
};
/**
 * Get dependency status help list by page and params
 * @param start
 * @param limit
 * @param sort
 */
const getDependencyStatusHelpListByPageAndParams = async ({ start, limit, sort, }) => {
    try {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] start: ${start}`);
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] limit: ${limit}`);
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] sort: ${sort}`);
        // Construct the query options based on provided arguments
        const queryOptions = {};
        // Handle pagination
        if (start) {
            queryOptions.offset = start;
        }
        if (limit) {
            queryOptions.limit = limit;
        }
        const dependencyStatusHelpList = await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] dependencyStatusHelpList: ${dependencyStatusHelpList?.length}`);
        return dependencyStatusHelpList;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Get dependency status help details by params
 * @param _id
 * @param category
 */
const getDependencyStatusHelpDetailsByParams = async ({ _id, category, }) => {
    try {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] _id: ${_id}`);
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] category: ${category}`);
        const dependencyStatusHelpDetails = _id
            ? (await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.findOne({
                where: {
                    _id,
                },
            }))?.dataValues
            : (await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.findOne({
                where: {
                    category,
                },
            }))?.dataValues;
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] dependencyStatusHelpDetails _id: ${dependencyStatusHelpDetails?._id}`);
        if (!dependencyStatusHelpDetails?._id) {
            return null;
        }
        return dependencyStatusHelpDetails;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] error: ${error}`);
        return null;
    }
};
/**
 * Initialize default data
 */
const initDefaultData = async () => {
    try {
        const dependencyStatusHelpCount = await DependencyStatusHelpModel_1.DependencyStatusHelpModelType.count();
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - initDefaultData] dependencyStatusHelpCount:  ${dependencyStatusHelpCount}`);
        if (dependencyStatusHelpCount > 0) {
            return true;
        }
        for (const dependencyStatusHelp of DependencyStatusHelpConfig_1.defaultDependencyStatusHelp) {
            await createDependencyStatusHelp(dependencyStatusHelp);
        }
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[DependencyStatusHelpProvider - initDefaultData] error:  ${error}`);
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
exports.default = DependencyStatusHelpProvider;
