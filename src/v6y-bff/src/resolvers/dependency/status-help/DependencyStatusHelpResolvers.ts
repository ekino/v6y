import DependencyStatusHelpMutations from './DependencyStatusHelpMutations.js';
import DependencyStatusHelpQueries from './DependencyStatusHelpQueries.js';

const DependencyStatusHelpResolvers = {
    Query: {
        ...DependencyStatusHelpQueries,
    },
    Mutation: {
        ...DependencyStatusHelpMutations,
    },
};

export default DependencyStatusHelpResolvers;
