import { AppLogger } from '@v6y/commons';

const createOrEditAuditHelp = async (_, params) => {
    try {
        const { auditHelpId, title, description, category, explanation } =
            params?.auditHelpInput || {};

        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] auditHelpId : ${auditHelpId}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] title : ${title}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] description : ${description}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] explanation : ${explanation}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] category : ${category}`);

        return {
            _id: auditHelpId || 'AZ987',
            title,
            description,
            category,
            explanation,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] error : ${error.message}`);
        return {};
    }
};

const deleteAuditHelp = async (_, params) => {
    try {
        const auditHelpId = params?.input?.where?.id || {};
        AppLogger.info(`[AuditHelpMutations - deleteAuditHelp] auditHelpId : ${auditHelpId}`);

        return {
            _id: auditHelpId,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpMutations - deleteAuditHelp] error : ${error.message}`);
        return {};
    }
};

const AuditHelpMutations = {
    createOrEditAuditHelp,
    deleteAuditHelp,
};

export default AuditHelpMutations;
