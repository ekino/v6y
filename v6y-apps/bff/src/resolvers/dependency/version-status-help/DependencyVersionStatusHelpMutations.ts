import {
    AppLogger,
    DependencyVersionStatusHelpInputType,
    DependencyVersionStatusHelpProvider,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Create or edit dependency version status help
 * @param _
 * @param params
 */
const createOrEditDependencyVersionStatusHelp = async (
    _: unknown,
    params: { dependencyVersionStatusHelpInput: DependencyVersionStatusHelpInputType },
) => {
    try {
        const { _id, title, description, category, links } =
            params?.dependencyVersionStatusHelpInput || {};

        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] _id : ${_id}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] title : ${title}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] description : ${description}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] links : ${links?.join(
                ',',
            )}`,
        );

        if (_id) {
            const editedDependencyVersionStatusHelp =
                await DependencyVersionStatusHelpProvider.editDependencyVersionStatusHelp({
                    _id,
                    title,
                    description,
                    category,
                    links,
                });

            AppLogger.info(
                `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] editedDependencyVersionStatusHelp : ${editedDependencyVersionStatusHelp?._id}`,
            );

            return {
                _id,
            };
        }

        const createdDependencyVersionStatusHelp =
            await DependencyVersionStatusHelpProvider.createDependencyVersionStatusHelp({
                title,
                description,
                category,
                links,
            });

        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] createdDependencyVersionStatusHelp : ${createdDependencyVersionStatusHelp?._id}`,
        );

        return createdDependencyVersionStatusHelp;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - createOrEditDependencyVersionStatusHelp] error : ${error}`,
        );
        return null;
    }
};

/**
 * Delete dependency version status help
 * @param _
 * @param params
 */
const deleteDependencyVersionStatusHelp = async (
    _: unknown,
    params: { input: SearchQueryType },
) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const dependencyVersionStatusHelpId = whereClause.id;
        if (!dependencyVersionStatusHelpId) {
            return null;
        }

        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - deleteDependencyVersionStatusHelp] dependencyVersionStatusHelpId : ${dependencyVersionStatusHelpId}`,
        );

        await DependencyVersionStatusHelpProvider.deleteDependencyVersionStatusHelp({
            _id: parseInt(dependencyVersionStatusHelpId, 10),
        });

        return {
            _id: dependencyVersionStatusHelpId,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpMutations - deleteDependencyVersionStatusHelp] error : ${error}`,
        );
        return null;
    }
};

const DependencyVersionStatusHelpMutations = {
    createOrEditDependencyVersionStatusHelp,
    deleteDependencyVersionStatusHelp,
};

export default DependencyVersionStatusHelpMutations;
