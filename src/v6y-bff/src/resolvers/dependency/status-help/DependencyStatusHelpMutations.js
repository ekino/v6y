import { AppLogger, DependencyStatusHelpProvider } from '@v6y/commons';

/**
 * Creates or edits a dependency status help entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the dependency status help input data.
 * @returns An object representing the created or edited dependency status help entry,
 * or an empty object on error.
 */
const createOrEditDependencyStatusHelp = async (_, params) => {
    try {
        const { dependencyStatusHelpId, title, description, category, links } =
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

        if (dependencyStatusHelpId) {
            const editedDependencyStatusHelp =
                await DependencyStatusHelpProvider.editDependencyStatusHelp({
                    _id: dependencyStatusHelpId,
                    title,
                    description,
                    category,
                    links,
                });

            AppLogger.info(
                `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] editedDependencyStatusHelp : ${editedDependencyStatusHelp?._id}`,
            );

            return {
                _id: dependencyStatusHelpId,
            };
        }

        const createdDependencyStatusHelp =
            await DependencyStatusHelpProvider.createDependencyStatusHelp({
                title,
                description,
                category,
                links,
            });

        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] createdDependencyStatusHelp : ${createdDependencyStatusHelp?._id}`,
        );

        return createdDependencyStatusHelp;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes a dependency status help entry
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the dependency status help ID to delete
 * @returns An object containing the deleted dependency status help ID or an empty object on error.
 */
const deleteDependencyStatusHelp = async (_, params) => {
    try {
        const dependencyStatusHelpId = params?.input?.where?.id || {};
        AppLogger.info(
            `[DependencyStatusHelpMutations - deleteDependencyStatusHelp] dependencyStatusHelpId : ${dependencyStatusHelpId}`,
        );

        await DependencyStatusHelpProvider.deleteDependencyStatusHelp({ dependencyStatusHelpId });

        return {
            _id: dependencyStatusHelpId,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpMutations - deleteDependencyStatusHelp] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * An object containing dependency status help mutation functions
 */
const DependencyStatusHelpMutations = {
    createOrEditDependencyStatusHelp,
    deleteDependencyStatusHelp,
};

export default DependencyStatusHelpMutations;
