"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const DeprecatedDependencyModel_1 = require("./models/DeprecatedDependencyModel");
/**
 * Create a new deprecated dependency
 * @param deprecatedDependency
 */
const createDeprecatedDependency = async (deprecatedDependency) => {
    try {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - createDeprecatedDependency] deprecatedDependency name:  ${deprecatedDependency?.name}`);
        if (!deprecatedDependency?.name?.length) {
            return null;
        }
        const createdDeprecatedDependency = await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.create(deprecatedDependency);
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - createDeprecatedDependency] createdDeprecatedDependency _id: ${createdDeprecatedDependency?._id}`);
        return createdDeprecatedDependency;
    }
    catch (error) {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - createDeprecatedDependency] error:  ${error}`);
        return null;
    }
};
/**
 * Edit an existing deprecated dependency
 * @param deprecatedDependency
 */
const editDeprecatedDependency = async (deprecatedDependency) => {
    try {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - editDeprecatedDependency] deprecatedDependency id:  ${deprecatedDependency?._id}`);
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - editDeprecatedDependency] deprecatedDependency name:  ${deprecatedDependency?.name}`);
        if (!deprecatedDependency?._id || !deprecatedDependency?.name?.length) {
            return null;
        }
        const editedDeprecatedDependency = await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.update(deprecatedDependency, {
            where: {
                _id: deprecatedDependency?._id,
            },
        });
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - editDeprecatedDependency] editedDeprecatedDependency: ${editedDeprecatedDependency?.[0]}`);
        return {
            _id: deprecatedDependency?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - editDeprecatedDependency] error:  ${error}`);
        return null;
    }
};
/**
 * Delete a deprecated dependency
 * @param _id
 */
const deleteDeprecatedDependency = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - deleteDeprecatedDependency] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - deleteDeprecatedDependency] error:  ${error}`);
        return null;
    }
};
/**
 * Delete all deprecated dependencies
 */
const deleteDeprecatedDependencyList = async () => {
    try {
        await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - deleteDeprecatedDependencyList] error:  ${error}`);
        return false;
    }
};
/**
 * Get deprecated dependencies by page and query parameters
 * @param start
 * @param limit
 * @param sort
 */
const getDeprecatedDependencyListByPageAndParams = async ({ start, limit, sort, }) => {
    try {
        // Construct the query options based on provided arguments
        const queryOptions = {};
        // Handle pagination
        if (start !== undefined) {
            // queryOptions.offset = start;
        }
        if (limit !== undefined) {
            //    queryOptions.limit = limit;
        }
        // Handle sorting
        if (sort) {
            // queryOptions.order = sort; // Assuming 'sort' specifies the sorting order directly
        }
        const deprecatedDependencyList = await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] deprecatedDependencyList: ${deprecatedDependencyList?.length}`);
        return deprecatedDependencyList;
    }
    catch (error) {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Get deprecated dependency details by parameters
 * @param _id
 * @param name
 */
const getDeprecatedDependencyDetailsByParams = async ({ _id, name }) => {
    try {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] _id: ${_id}`);
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] name: ${name}`);
        const deprecatedDependencyDetails = _id
            ? (await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.findOne({
                where: {
                    _id,
                },
            }))?.dataValues
            : (await DeprecatedDependencyModel_1.DeprecatedDependencyModelType.findOne({
                where: {
                    name,
                },
            }))?.dataValues;
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] deprecatedDependencyDetails _id: ${deprecatedDependencyDetails?._id}`);
        if (!deprecatedDependencyDetails?._id) {
            return null;
        }
        return deprecatedDependencyDetails;
    }
    catch (error) {
        AppLogger_1.default.info(`[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] error: ${error}`);
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
exports.default = DeprecatedDependencyProvider;
