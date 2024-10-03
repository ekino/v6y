import {
    AppLogger,
    EvolutionHelpInputType,
    EvolutionHelpProvider,
    SearchQueryType,
} from '@v6y/commons';

/**
 * Create or edit evolution help
 * @param _
 * @param params
 */
const createOrEditEvolutionHelp = async (
    _: unknown,
    params: { evolutionHelpInput: EvolutionHelpInputType },
) => {
    try {
        const { _id, title, description, category, status, links } =
            params?.evolutionHelpInput || {};

        AppLogger.info(`[EvolutionHelpMutations - createOrEditEvolutionHelp] _id : ${_id}`);
        AppLogger.info(`[EvolutionHelpMutations - createOrEditEvolutionHelp] title : ${title}`);
        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] description : ${description}`,
        );
        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] links : ${links?.join(',')}`,
        );

        if (_id) {
            const editedEvolutionHelp = await EvolutionHelpProvider.editEvolutionHelp({
                _id,
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
                _id,
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
        AppLogger.info(`[EvolutionHelpMutations - createOrEditEvolutionHelp] error : ${error}`);
        return null;
    }
};

/**
 * Delete evolution help
 * @param _
 * @param params
 */
const deleteEvolutionHelp = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const evolutionHelpId = whereClause._id;
        AppLogger.info(
            `[EvolutionHelpMutations - deleteEvolutionHelp] evolutionHelpId : ${evolutionHelpId}`,
        );

        await EvolutionHelpProvider.deleteEvolutionHelp({ _id: evolutionHelpId });

        return {
            _id: evolutionHelpId,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpMutations - deleteEvolutionHelp] error : ${error}`);
        return null;
    }
};

const EvolutionHelpMutations = {
    createOrEditEvolutionHelp,
    deleteEvolutionHelp,
};

export default EvolutionHelpMutations;
