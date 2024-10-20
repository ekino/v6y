import { AppLogger, AuditHelpProvider, AuditHelpType, SearchQueryType } from '@v6y/commons';

/**
 * Create or edit audit help
 * @param _
 * @param params
 */
const createOrEditAuditHelp = async (_: unknown, params: { auditHelpInput: AuditHelpType }) => {
    try {
        const { _id, title, description, category, explanation } = params?.auditHelpInput || {};

        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] _id : ${_id}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] title : ${title}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] description : ${description}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] explanation : ${explanation}`);
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] category : ${category}`);

        if (_id) {
            const editedAuditHelp = await AuditHelpProvider.editAuditHelp({
                _id,
                title,
                description,
                category,
                explanation,
            });

            AppLogger.info(
                `[AuditHelpMutations - createOrEditAuditHelp] editedAuditHelp : ${editedAuditHelp?._id}`,
            );

            return {
                _id,
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
        AppLogger.info(`[AuditHelpMutations - createOrEditAuditHelp] error : ${error}`);
        return null;
    }
};

/**
 * Delete audit help
 * @param _
 * @param params
 */
const deleteAuditHelp = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const auditHelpId = whereClause.id;
        if (!auditHelpId) {
            return null;
        }

        AppLogger.info(`[AuditHelpMutations - deleteAuditHelp] auditHelpId : ${auditHelpId}`);

        await AuditHelpProvider.deleteAuditHelp({ _id: parseInt(auditHelpId, 10) });

        return {
            _id: auditHelpId,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpMutations - deleteAuditHelp] error : ${error}`);
        return null;
    }
};

const AuditHelpMutations = {
    createOrEditAuditHelp,
    deleteAuditHelp,
};

export default AuditHelpMutations;
