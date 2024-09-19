import EvolutionHelpMutations from './EvolutionHelpMutations.js';
import EvolutionHelpQueries from './EvolutionHelpQueries.js';

const EvolutionHelpResolvers = {
    Query: {
        ...EvolutionHelpQueries,
    },
    Mutation: {
        ...EvolutionHelpMutations,
    },
};

export default EvolutionHelpResolvers;
