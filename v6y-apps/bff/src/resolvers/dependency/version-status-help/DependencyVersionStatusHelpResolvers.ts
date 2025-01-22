import DependencyVersionStatusHelpMutations from './DependencyVersionStatusHelpMutations.ts';
import DependencyVersionStatusHelpQueries from './DependencyVersionStatusHelpQueries.ts';

const DependencyVersionStatusHelpResolvers = {
    Query: {
        ...DependencyVersionStatusHelpQueries,
    },
    Mutation: {
        ...DependencyVersionStatusHelpMutations,
    },
};

export default DependencyVersionStatusHelpResolvers;
