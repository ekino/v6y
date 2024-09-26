"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuditHelpConfig_1 = require("../config/AuditHelpConfig");
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const AuditHelpModel_1 = require("./models/AuditHelpModel");
const createAuditHelp = async (auditHelp) => {
    try {
        AppLogger_1.default.info(`[AuditHelpProvider - createAuditHelp] auditHelp title:  ${auditHelp?.title}`);
        if (!auditHelp?.title?.length) {
            return null;
        }
        const createdAuditHelp = await AuditHelpModel_1.AuditHelpModelType.create(auditHelp);
        AppLogger_1.default.info(`[AuditHelpProvider - createAuditHelp] createdAuditHelp: ${createdAuditHelp?._id}`);
        return createdAuditHelp;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - createAuditHelp] error:  ${error}`);
        return null;
    }
};
const editAuditHelp = async (auditHelp) => {
    try {
        AppLogger_1.default.info(`[AuditHelpProvider - editAuditHelp] auditHelp id:  ${auditHelp?._id}`);
        AppLogger_1.default.info(`[AuditHelpProvider - editAuditHelp] auditHelp title:  ${auditHelp?.title}`);
        if (!auditHelp?._id || !auditHelp?.title?.length) {
            return null;
        }
        const editedAuditHelp = await AuditHelpModel_1.AuditHelpModelType.update(auditHelp, {
            where: {
                _id: auditHelp?._id,
            },
        });
        AppLogger_1.default.info(`[AuditHelpProvider - editAuditHelp] editedAuditHelp: ${editedAuditHelp?.[0]}`);
        return {
            _id: auditHelp?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - editAuditHelp] error:  ${error}`);
        return null;
    }
};
const deleteAuditHelp = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[AuditHelpProvider - deleteAuditHelp] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await AuditHelpModel_1.AuditHelpModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - deleteAuditHelp] error:  ${error}`);
        return null;
    }
};
const deleteAuditHelpList = async () => {
    try {
        await AuditHelpModel_1.AuditHelpModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - deleteAuditHelpList] error:  ${error}`);
        return false;
    }
};
const getAuditHelpListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] start: ${start}`);
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] limit: ${limit}`);
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] sort: ${sort}`);
        // Construct the query options based on provided arguments
        const queryOptions = {};
        // Handle pagination
        if (start) {
            queryOptions.offset = start;
        }
        if (limit) {
            queryOptions.limit = limit;
        }
        const auditHelpList = await AuditHelpModel_1.AuditHelpModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] auditHelpList: ${auditHelpList?.length}`);
        return auditHelpList;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] error:  ${error}`);
        return [];
    }
};
const getAuditHelpDetailsByParams = async ({ _id, category }) => {
    try {
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] _id: ${_id}`);
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] category: ${category}`);
        const auditHelpDetails = _id
            ? (await AuditHelpModel_1.AuditHelpModelType.findOne({
                where: {
                    _id,
                },
            }))?.dataValues
            : (await AuditHelpModel_1.AuditHelpModelType.findOne({
                where: {
                    category,
                },
            }))?.dataValues;
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] auditHelpDetails _id: ${auditHelpDetails?._id}`);
        if (!auditHelpDetails?._id) {
            return null;
        }
        return auditHelpDetails;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] error: ${error}`);
        return null;
    }
};
const initDefaultData = async () => {
    try {
        AppLogger_1.default.info(`[AuditHelpProvider - initDefaultData] start`);
        const auditHelpCount = await AuditHelpModel_1.AuditHelpModelType.count();
        AppLogger_1.default.info(`[AuditHelpProvider - initDefaultData] auditHelpCount:  ${auditHelpCount}`);
        if (auditHelpCount > 0) {
            return true;
        }
        for (const auditHelp of AuditHelpConfig_1.defaultAuditHelpStatus) {
            await createAuditHelp(auditHelp);
        }
        AppLogger_1.default.info(`[AuditHelpProvider - initDefaultData] end`);
        return true; // Indicate successful initialization
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditHelpProvider - initDefaultData] error:  ${error}`);
        return false;
    }
};
const AuditHelpProvider = {
    initDefaultData,
    createAuditHelp,
    editAuditHelp,
    deleteAuditHelp,
    deleteAuditHelpList,
    getAuditHelpListByPageAndParams,
    getAuditHelpDetailsByParams,
};
exports.default = AuditHelpProvider;
