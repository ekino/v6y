import { AppLogger, DeprecatedDependencyProvider } from '@v6y/commons';

/**
 * Creates or edits a deprecated dependency entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the deprecated dependency input data.
 * @returns An object representing the created or edited deprecated dependency entry,
 *          or an empty object on error.
 */
const createOrEditDeprecatedDependency = async (_, params) => {
    try {
        const { deprecatedDependencyId, name } = params?.deprecatedDependencyInput || {};

        AppLogger.info(
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] name : ${name}`,
        );

        if (deprecatedDependencyId) {
            const editedDeprecatedDependency =
                await DeprecatedDependencyProvider.editDeprecatedDependency({
                    _id: deprecatedDependencyId,
                    name,
                });

            AppLogger.info(
                `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] editedDeprecatedDependency : ${editedDeprecatedDependency?._id}`,
            );

            return {
                _id: deprecatedDependencyId,
            };
        }

        const createdDeprecatedDependency =
            await DeprecatedDependencyProvider.createDeprecatedDependency({
                name,
            });

        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] createdDeprecatedDependency : ${createdDeprecatedDependency?._id}`,
        );

        return createdDeprecatedDependency;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes a deprecated dependency entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the deprecated dependency ID to delete.
 * @returns An object containing the deleted deprecated dependency ID, or an empty object on error.
 */
const deleteDeprecatedDependency = async (_, params) => {
    try {
        const deprecatedDependencyId = params?.input?.where?.id || {};
        AppLogger.info(
            `[DeprecatedDependencyMutations - deleteDeprecatedDependency] deprecatedDependencyId : ${deprecatedDependencyId}`,
        );

        await DeprecatedDependencyProvider.deleteDeprecatedDependency({ deprecatedDependencyId });

        return {
            _id: deprecatedDependencyId,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyMutations - deleteDeprecatedDependency] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * An object containing deprecated dependency mutation functions.
 */
const DeprecatedDependencyMutations = {
    createOrEditDeprecatedDependency,
    deleteDeprecatedDependency,
};

export default DeprecatedDependencyMutations;
