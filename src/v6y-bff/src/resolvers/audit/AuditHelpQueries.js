import { AppLogger, AuditHelpProvider } from '@v6y/commons';

const getAuditHelpListByPageAndParams = async (_, args) => {
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
        AppLogger.info(
            `[AuditHelpQueries - getAuditHelpListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

const getAuditHelpDetailsByParams = async (_, args) => {
    try {
        const { auditHelpId } = args || {};

        AppLogger.info(
            `[AuditHelpQueries - getAuditHelpDetailsByParams] auditHelpId : ${auditHelpId}`,
        );

        const appDetails = await AuditHelpProvider.getAuditHelpDetailsByParams({
            auditHelpId,
        });

        AppLogger.info(
            `[AuditHelpQueries - getAuditHelpDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AuditHelpQueries - getAuditHelpDetailsByParams] error : ${error.message}`);
        return {};
    }
};

const AuditHelpQueries = {
    getAuditHelpListByPageAndParams,
    getAuditHelpDetailsByParams,
};

export default AuditHelpQueries;
