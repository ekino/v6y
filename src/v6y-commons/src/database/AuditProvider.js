import { auditsReports } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';
import AuditHelpProvider from './AuditHelpProvider.js';

const insertAudit = async (app, audit) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(`[AuditProvider - insertAudit] error:  ${error.message}`);
        return {};
    }
};

const insertAuditList = async (app, auditList) => {
    try {
        if (!auditList?.length) {
            return;
        }

        for (const audit of auditList) {
            await insertAudit(app, audit);
        }
    } catch (error) {
        AppLogger.info(`[AuditProvider - insertAuditList] error:  ${error.message}`);
    }
};

const deleteAuditsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAuditsList] error:  ${error.message}`);
    }
};

const getAuditListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] appId: ${appId}`);

        // read from DB
        const reports = auditsReports;
        if (!reports?.length) {
            return;
        }

        return reports
            ?.filter((report) => report?.module?.appId === appId)
            ?.map((audit) => ({
                ...audit,
                auditHelp: AuditHelpProvider.getAuditHelpDetailsByParams({
                    category: [`${audit.type}-${audit.category}`],
                }),
            }));
    } catch (error) {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] error:  ${error.message}`);
        return [];
    }
};

const AuditProvider = {
    insertAuditList,
    getAuditListByPageAndParams,
    deleteAuditsList,
};

export default AuditProvider;
