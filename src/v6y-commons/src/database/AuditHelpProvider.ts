import { FindOptions } from 'sequelize';

import { defaultAuditHelpStatus } from '../config/AuditHelpConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import { AuditHelpType } from '../types/AuditHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { AuditHelpModelType } from './models/AuditHelpModel.ts';

const createAuditHelp = async (auditHelp: AuditHelpType): Promise<AuditHelpType | null> => {
    try {
        AppLogger.info(
            `[AuditHelpProvider - createAuditHelp] auditHelp title:  ${auditHelp?.title}`,
        );
        if (!auditHelp?.title?.length) {
            return null;
        }

        const createdAuditHelp = await AuditHelpModelType.create(auditHelp);
        AppLogger.info(
            `[AuditHelpProvider - createAuditHelp] createdAuditHelp: ${createdAuditHelp?._id}`,
        );

        return createdAuditHelp;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - createAuditHelp] error:  ${error}`);
        return null;
    }
};

const editAuditHelp = async (auditHelp: AuditHelpType) => {
    try {
        AppLogger.info(`[AuditHelpProvider - editAuditHelp] auditHelp id:  ${auditHelp?._id}`);
        AppLogger.info(`[AuditHelpProvider - editAuditHelp] auditHelp title:  ${auditHelp?.title}`);

        if (!auditHelp?._id || !auditHelp?.title?.length) {
            return null;
        }

        const editedAuditHelp = await AuditHelpModelType.update(auditHelp, {
            where: {
                _id: auditHelp?._id,
            },
        });

        AppLogger.info(
            `[AuditHelpProvider - editAuditHelp] editedAuditHelp: ${editedAuditHelp?.[0]}`,
        );

        return {
            _id: auditHelp?._id,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - editAuditHelp] error:  ${error}`);
        return null;
    }
};

const deleteAuditHelp = async ({ _id }: AuditHelpType) => {
    try {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelp] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await AuditHelpModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelp] error:  ${error}`);
        return null;
    }
};

const deleteAuditHelpList = async () => {
    try {
        await AuditHelpModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelpList] error:  ${error}`);
        return false;
    }
};

const getAuditHelpListByPageAndParams = async ({ start, limit, sort }: SearchQueryType) => {
    try {
        AppLogger.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] start: ${start}`);
        AppLogger.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] limit: ${limit}`);
        AppLogger.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] sort: ${sort}`);

        // Construct the query options based on provided arguments
        const queryOptions: FindOptions = {};

        // Handle pagination
        if (start) {
            queryOptions.offset = start;
        }

        if (limit) {
            queryOptions.limit = limit;
        }

        const auditHelpList = await AuditHelpModelType.findAll(queryOptions);
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpListByPageAndParams] auditHelpList: ${auditHelpList?.length}`,
        );

        return auditHelpList;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - getAuditHelpListByPageAndParams] error:  ${error}`);
        return [];
    }
};

const getAuditHelpDetailsByParams = async ({ _id, category }: AuditHelpType) => {
    try {
        AppLogger.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] _id: ${_id}`);
        AppLogger.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] category: ${category}`);

        const auditHelpDetails = _id
            ? (
                  await AuditHelpModelType.findOne({
                      where: {
                          _id,
                      },
                  })
              )?.dataValues
            : (
                  await AuditHelpModelType.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpDetailsByParams] auditHelpDetails _id: ${auditHelpDetails?._id}`,
        );

        if (!auditHelpDetails?._id) {
            return null;
        }

        return auditHelpDetails;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] error: ${error}`);
        return null;
    }
};

const initDefaultData = async () => {
    try {
        AppLogger.info(`[AuditHelpProvider - initDefaultData] start`);

        const auditHelpCount = await AuditHelpModelType.count();

        AppLogger.info(`[AuditHelpProvider - initDefaultData] auditHelpCount:  ${auditHelpCount}`);

        if (auditHelpCount > 0) {
            return true;
        }

        for (const auditHelp of defaultAuditHelpStatus) {
            await createAuditHelp(auditHelp);
        }

        AppLogger.info(`[AuditHelpProvider - initDefaultData] end`);

        return true; // Indicate successful initialization
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - initDefaultData] error:  ${error}`);
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

export default AuditHelpProvider;
