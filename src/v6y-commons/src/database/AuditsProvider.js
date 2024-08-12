import AppLogger from '../core/AppLogger.js';

const insertAudit = async (app, audit) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(`[insertAudit] error:  ${error.message}`);
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
        AppLogger.info(`[insertAuditList] error:  ${error.message}`);
    }
};

const deleteAuditsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteAuditsList] error:  ${error.message}`);
    }
};

const getAuditsByParams = async () => {
    try {
        return [];
    } catch (error) {
        AppLogger.info(`[getAuditsByParams] error:  ${error.message}`);
        return [];
    }
};

const AuditsProvider = {
    insertAuditList,
    getAuditsByParams,
    deleteAuditsList,
};

export default AuditsProvider;
