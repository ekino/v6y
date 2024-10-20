import {
    AppLogger,
    DependencyStatusHelpInputType,
    DependencyStatusHelpProvider,
    SearchQueryType,
} from '@v6y/commons';

/**
 * Create or edit dependency status help
 * @param _
 * @param params
 */
const createOrEditDependencyStatusHelp = async (
    _: unknown,
    params: { dependencyStatusHelpInput: DependencyStatusHelpInputType },
) => {
    try {
        const { _id, title, description, category, links } =
            params?.dependencyStatusHelpInput || {};

        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] _id : ${_id}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] title : ${title}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] description : ${description}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] links : ${links?.join(
                ',',
            )}`,
        );

        if (_id) {
            const editedDependencyStatusHelp =
                await DependencyStatusHelpProvider.editDependencyStatusHelp({
                    _id,
                    title,
                    description,
                    category,
                    links,
                });

            AppLogger.info(
                `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] editedDependencyStatusHelp : ${editedDependencyStatusHelp?._id}`,
            );

            return {
                _id,
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
            `[DependencyStatusHelpMutations - createOrEditDependencyStatusHelp] error : ${error}`,
        );
        return null;
    }
};

/**
 * Delete dependency status help
 * @param _
 * @param params
 */
const deleteDependencyStatusHelp = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const dependencyStatusHelpId = whereClause.id;
        if (!dependencyStatusHelpId) {
            return null;
        }

        AppLogger.info(
            `[DependencyStatusHelpMutations - deleteDependencyStatusHelp] dependencyStatusHelpId : ${dependencyStatusHelpId}`,
        );

        await DependencyStatusHelpProvider.deleteDependencyStatusHelp({
            _id: parseInt(dependencyStatusHelpId, 10),
        });

        return {
            _id: dependencyStatusHelpId,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpMutations - deleteDependencyStatusHelp] error : ${error}`,
        );
        return null;
    }
};

const DependencyStatusHelpMutations = {
    createOrEditDependencyStatusHelp,
    deleteDependencyStatusHelp,
};

export default DependencyStatusHelpMutations;
