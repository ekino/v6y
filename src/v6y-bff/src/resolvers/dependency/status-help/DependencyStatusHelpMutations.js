import { AppLogger } from '@v6y/commons';

const createOrEditDependencyStatusHelp = async (_, params) => {
    try {
        const { dependencyStatusHelpId, title, description, category, status, links } =
            params?.dependencyStatusHelpInput || {};

        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] dependencyStatusHelpId : ${dependencyStatusHelpId}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] title : ${title}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] description : ${description}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] links : ${links?.join(',')}`,
        );

        return {
            _id: dependencyStatusHelpId || 'AZ987',
            title,
            description,
            category,
            status,
            links,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] error : ${error.message}`,
        );
        return {};
    }
};

const deleteDependencyStatusHelp = async (_, params) => {
    try {
        const dependencyStatusHelpId = params?.input?.where?.id || {};
        AppLogger.info(
            `[DependencyStatusHelpMutations - deleteDependencyStatusHelp] dependencyStatusHelpId : ${dependencyStatusHelpId}`,
        );

        return {
            _id: dependencyStatusHelpId,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpMutations - deleteDependencyStatusHelp] error : ${error.message}`,
        );
        return {};
    }
};

const DependencyStatusHelpMutations = {
    createOrEditDependencyStatusHelp,
    deleteDependencyStatusHelp,
};

export default DependencyStatusHelpMutations;
