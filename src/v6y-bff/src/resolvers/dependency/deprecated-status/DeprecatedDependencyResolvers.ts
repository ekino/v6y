import DeprecatedDependencyMutations from './DeprecatedDependencyMutations.ts';
import DeprecatedDependencyQueries from './DeprecatedDependencyQueries.ts';

const DeprecatedDependencyResolvers = {
    Query: {
        ...DeprecatedDependencyQueries,
    },
    Mutation: {
        ...DeprecatedDependencyMutations,
    },
};

export default DeprecatedDependencyResolvers;
