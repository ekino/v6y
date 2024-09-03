import { AppLogger, AuditHelpProvider } from '@v6y/commons';

/**
 * Retrieves a list of audit help entries based on pagination and filtering parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments including pagination, filtering, and sorting options:
 *   - `start` (number): The starting index for pagination.
 *   - `limit` (number): The maximum number of audit help entries to retrieve.
 *   - `where` (object): An object specifying filtering conditions.
 *   - `sort` (object): An object defining the sorting criteria.
 * @returns An array of audit help entries matching the specified criteria or an empty array on error.
 */
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

/**
 * Retrieves the details of a specific audit help entry by its ID
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing the query arguments, including `auditHelpId`.
 * @returns An object containing the audit help details or an empty object if not found or on error
 */
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
        return null;
    }
};

/**
 * An object containing audit help query functions.
 */
const AuditHelpQueries = {
    getAuditHelpListByPageAndParams,
    getAuditHelpDetailsByParams,
};

export default AuditHelpQueries;
