import {
    AppLogger,
    DeprecatedDependencyProvider,
    DeprecatedDependencyType,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Create or edit deprecated dependency
 * @param _
 * @param params
 */
const createOrEditDeprecatedDependency = async (
    _: unknown,
    params: { deprecatedDependencyInput: DeprecatedDependencyType },
) => {
    try {
        const { _id, name } = params?.deprecatedDependencyInput || {};

        AppLogger.info(
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] _id : ${_id}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] name : ${name}`,
        );

        if (_id) {
            const editedDeprecatedDependency =
                await DeprecatedDependencyProvider.editDeprecatedDependency({
                    _id,
                    name,
                });

            AppLogger.info(
                `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] editedDeprecatedDependency : ${editedDeprecatedDependency?._id}`,
            );

            return {
                _id,
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
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] error : ${error}`,
        );
        return null;
    }
};

/**
 * Delete deprecated dependency
 * @param _
 * @param params
 */
const deleteDeprecatedDependency = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input;
        if (!whereClause) {
            return null;
        }

        const deprecatedDependencyId = whereClause.id;
        if (!deprecatedDependencyId) {
            return null;
        }

        AppLogger.info(
            `[DeprecatedDependencyMutations - deleteDeprecatedDependency] deprecatedDependencyId : ${deprecatedDependencyId}`,
        );

        await DeprecatedDependencyProvider.deleteDeprecatedDependency({
            _id: parseInt(deprecatedDependencyId, 10),
        });

        return {
            _id: deprecatedDependencyId,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyMutations - deleteDeprecatedDependency] error : ${error}`,
        );
        return null;
    }
};

const DeprecatedDependencyMutations = {
    createOrEditDeprecatedDependency,
    deleteDeprecatedDependency,
};

export default DeprecatedDependencyMutations;
