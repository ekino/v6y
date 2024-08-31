import { AppLogger } from '@v6y/commons';

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

        return {
            _id: evolutionHelpId || 'AZ987',
            title,
            description,
            category,
            status,
            links,
        };
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpMutations - createOrEditEvolutionHelp] error : ${error.message}`,
        );
        return {};
    }
};

const deleteEvolutionHelp = async (_, params) => {
    try {
        const evolutionHelpId = params?.input?.where?.id || {};
        AppLogger.info(
            `[EvolutionHelpMutations - deleteEvolutionHelp] evolutionHelpId : ${evolutionHelpId}`,
        );

        return {
            _id: evolutionHelpId,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpMutations - deleteEvolutionHelp] error : ${error.message}`);
        return {};
    }
};

const EvolutionHelpMutations = {
    createOrEditEvolutionHelp,
    deleteEvolutionHelp,
};

export default EvolutionHelpMutations;
