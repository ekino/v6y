import DeprecatedDependencyMutations from './DeprecatedDependencyMutations.js';
import DeprecatedDependencyQueries from './DeprecatedDependencyQueries.js';

const DeprecatedDependencyResolvers = {
    Query: {
        ...DeprecatedDependencyQueries,
    },
    Mutation: {
        ...DeprecatedDependencyMutations,
    },
};

export default DeprecatedDependencyResolvers;
