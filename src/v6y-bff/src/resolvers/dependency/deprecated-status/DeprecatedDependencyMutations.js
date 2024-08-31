import { AppLogger } from '@v6y/commons';

const createOrEditDeprecatedDependency = async (_, params) => {
    try {
        const { deprecatedDependencyId, name } = params?.deprecatedDependencyInput || {};

        AppLogger.info(
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] name : ${name}`,
        );

        return {
            _id: deprecatedDependencyId || 'AZ987',
            name,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyMutations - createOrEditDeprecatedDependency] error : ${error.message}`,
        );
        return {};
    }
};

const deleteDeprecatedDependency = async (_, params) => {
    try {
        const deprecatedDependencyId = params?.input?.where?.id || {};
        AppLogger.info(
            `[DeprecatedDependencyMutations - deleteDeprecatedDependency] deprecatedDependencyId : ${deprecatedDependencyId}`,
        );

        return {
            _id: deprecatedDependencyId,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyMutations - deleteDeprecatedDependency] error : ${error.message}`,
        );
        return {};
    }
};

const DeprecatedDependencyMutations = {
    createOrEditDeprecatedDependency,
    deleteDeprecatedDependency,
};

export default DeprecatedDependencyMutations;
