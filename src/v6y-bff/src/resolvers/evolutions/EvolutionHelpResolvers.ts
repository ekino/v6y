import EvolutionHelpMutations from './EvolutionHelpMutations.ts';
import EvolutionHelpQueries from './EvolutionHelpQueries.ts';

const EvolutionHelpResolvers = {
    Query: {
        ...EvolutionHelpQueries,
    },
    Mutation: {
        ...EvolutionHelpMutations,
    },
};

export default EvolutionHelpResolvers;
