import { AppLogger, AuditHelpProvider } from '@v6y/commons';

/**
 * Creates or edits an audit help entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the audit help input data.
 * @returns An object representing the created or edited audit help entry, or an empty object on error.
 */
const createOrEditAuditHelp = async (_, params) => {
    try {
        const { auditHelpId, title, description, category, explanation } =
            params?.auditHelpInput || {};

        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] auditHelpId : ${auditHelpId}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] title : ${title}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] description : ${description}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] explanation : ${explanation}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] category : ${category}`);

        if (auditHelpId) {
            const editedAuditHelp = await AuditHelpProvider.editAuditHelp({
                _id: auditHelpId,
                title,
                description,
                category,
                explanation,
            });

            AppLogger.info(
                `[AuditHelpMutations - createOrEditAuditHelp] editedAuditHelp : ${editedAuditHelp?._id}`,
            );

            return {
                _id: auditHelpId,
            };
        }

        const createdAuditHelp = await AuditHelpProvider.createAuditHelp({
            title,
            description,
            category,
            explanation,
        });

        AppLogger.info(
            `[AuditHelpMutations - createOrEditAuditHelp] createdAuditHelp : ${createdAuditHelp?._id}`,
        );

        return createdAuditHelp;
    } catch (error) {
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] error : ${error.message}`);
        return null;
    }
};

/**
 * Deletes an audit help entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the audit help ID to delete.
 * @returns An object containing the deleted audit help ID, or an empty object on error.
 */
const deleteAuditHelp = async (_, params) => {
    try {
        const auditHelpId = params?.input?.where?.id || {};
        AppLogger.info(`[AuditHelpMutations - deleteAuditHelp] auditHelpId : ${auditHelpId}`);

        await AuditHelpProvider.deleteAuditHelp({ auditHelpId });

        return {
            _id: auditHelpId,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpMutations - deleteAuditHelp] error : ${error.message}`);
        return null;
    }
};

const AuditHelpMutations = {
    createOrEditAuditHelp,
    deleteAuditHelp,
};

export default AuditHelpMutations;
