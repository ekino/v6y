import { auditHelps } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertAuditHelp = async (auditHelp) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - insertAuditHelp] error:  ${error.message}`);
        return {};
    }
};

const insertAuditHelpList = async (auditHelpList) => {
    try {
        if (!auditHelpList?.length) {
            return;
        }

        for (const auditHelp of auditHelpList) {
            await insertAuditHelp(auditHelp);
        }
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - insertAuditHelpList] error:  ${error.message}`);
    }
};

const deleteAuditHelpList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelpList] error:  ${error.message}`);
    }
};

const getAuditHelpDetailsByParams = async ({ category, auditHelpId }) => {
    try {
        AppLogger.info(
            `[AuditsProvider - getAuditHelpDetailsByParams] auditHelpId: ${auditHelpId}`,
        );
        AppLogger.info(`[AuditsProvider - getAuditHelpDetailsByParams] category: ${category}`);

        if (category?.length) {
            return auditHelps.find((auditHelp) => auditHelp.category === category);
        }

        if (auditHelpId?.length) {
            return auditHelps.find((auditHelp) => auditHelp._id === auditHelpId);
        }

        return {};
    } catch (error) {
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpDetailsByParams] error:  ${error.message}`,
        );
        return {};
    }
};

const getAuditHelpListByPageAndParams = async ({ start, limit, where, sort }) => {
    try {
        AppLogger.info(`[AuditsProvider - getAuditHelpListByPageAndParams] start: ${start}`);
        AppLogger.info(`[AuditsProvider - getAuditHelpListByPageAndParams] limit: ${limit}`);
        AppLogger.info(`[AuditsProvider - getAuditHelpListByPageAndParams] where: ${where}`);
        AppLogger.info(`[AuditsProvider - getAuditHelpListByPageAndParams] sort: ${sort}`);

        return auditHelps;
    } catch (error) {
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

const AuditHelpProvider = {
    insertAuditHelpList,
    deleteAuditHelpList,
    getAuditHelpDetailsByParams,
    getAuditHelpListByPageAndParams,
};

export default AuditHelpProvider;
