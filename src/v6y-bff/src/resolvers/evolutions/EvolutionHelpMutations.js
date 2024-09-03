import { AppLogger, EvolutionHelpProvider } from '@v6y/commons';

/**
 * Creates or edits an evolution help entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the evolution help input data.
 * @returns An object representing the created or edited evolution help entry,
 * or an empty object on error.
 */
const createOrEditEvolutionHelp = async (_, params) => {
    try {
        const { evolutionHelpId, title, description, category, status, links } =
            params?.evolutionHelpInput || {};

        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] evolutionHelpId : ${evolutionHelpId}`,
        );
        AppLogger.info(`[EvolutionHelpMutations - createOrEditEvolutionHelp] title : ${title}`);
        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] description : ${description}`,
        );
        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] links : ${links?.join(',')}`,
        );

        if (evolutionHelpId) {
            const editedEvolutionHelp = await EvolutionHelpProvider.editEvolutionHelp({
                _id: evolutionHelpId,
                title,
                description,
                category,
                status,
                links,
            });

            AppLogger.info(
                `[EvolutionHelpMutations - createOrEditEvolutionHelp] editedEvolutionHelp : ${editedEvolutionHelp?._id}`,
            );

            return {
                _id: evolutionHelpId,
            };
        }

        const createdEvolutionHelp = await EvolutionHelpProvider.createEvolutionHelp({
            title,
            description,
            category,
            status,
            links,
        });

        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] createdEvolutionHelp : ${createdEvolutionHelp?._id}`,
        );

        return createdEvolutionHelp;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes an evolution help entry
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the evolution help ID to delete
 * @returns An object containing the deleted evolution help ID or an empty object on error.
 */
const deleteEvolutionHelp = async (_, params) => {
    try {
        const evolutionHelpId = params?.input?.where?.id || {};
        AppLogger.info(
            `[EvolutionHelpMutations - deleteEvolutionHelp] evolutionHelpId : ${evolutionHelpId}`,
        );

        await EvolutionHelpProvider.deleteEvolutionHelp({ evolutionHelpId });

        return {
            _id: evolutionHelpId,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpMutations - deleteEvolutionHelp] error : ${error.message}`);
        return null;
    }
};

/**
 * An object containing evolution help mutation functions
 */
const EvolutionHelpMutations = {
    createOrEditEvolutionHelp,
    deleteEvolutionHelp,
};

export default EvolutionHelpMutations;
