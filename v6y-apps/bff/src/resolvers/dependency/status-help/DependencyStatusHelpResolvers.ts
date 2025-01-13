import DependencyStatusHelpMutations from './DependencyStatusHelpMutations.ts';
import DependencyStatusHelpQueries from './DependencyStatusHelpQueries.ts';

const DependencyStatusHelpResolvers = {
    Query: {
        ...DependencyStatusHelpQueries,
    },
    Mutation: {
        ...DependencyStatusHelpMutations,
    },
};

export default DependencyStatusHelpResolvers;
