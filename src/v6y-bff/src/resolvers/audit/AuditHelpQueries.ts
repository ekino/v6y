import { AppLogger, AuditHelpProvider, AuditHelpType, SearchQueryType } from '@v6y/commons';


/**
 * Get Audit Help List By Page And Params
 * @param _
 * @param args
 */
const getAuditHelpListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { start, limit, where, sort } = args || {};

        AppLogger.info(`[AuditHelpQueries - getAuditHelpListByPageAndParams] start : ${start}`);
        AppLogger.info(`[AuditHelpQueries - getAuditHelpListByPageAndParams] limit : ${limit}`);
        AppLogger.info(`[AuditHelpQueries - getAuditHelpListByPageAndParams] where : ${where}`);
        AppLogger.info(`[AuditHelpQueries - getAuditHelpListByPageAndParams] sort : ${sort}`);

        const auditHelpList = await AuditHelpProvider.getAuditHelpListByPageAndParams({
            start,
            limit,
            where,
            sort,
        });

        AppLogger.info(
            `[AuditHelpQueries - getAuditHelpListByPageAndParams] auditHelpList : ${auditHelpList?.length}`,
        );

        return auditHelpList;
    } catch (error) {
        AppLogger.info(`[AuditHelpQueries - getAuditHelpListByPageAndParams] error : ${error}`);
        return [];
    }
};

/**
 * Get Audit Help Details By Params
 * @param _
 * @param args
 */
const getAuditHelpDetailsByParams = async (_: unknown, args: AuditHelpType) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[AuditHelpQueries - getAuditHelpDetailsByParams] _id : ${_id}`);

        const appDetails = await AuditHelpProvider.getAuditHelpDetailsByParams({
            _id,
        });

        AppLogger.info(
            `[AuditHelpQueries - getAuditHelpDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AuditHelpQueries - getAuditHelpDetailsByParams] error : ${error}`);
        return null;
    }
};

const AuditHelpQueries = {
    getAuditHelpListByPageAndParams,
    getAuditHelpDetailsByParams,
};

export default AuditHelpQueries;
