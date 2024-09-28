import FaqMutations from './FaqMutations.js';
import FaqQueries from './FaqQueries.js';

const FaqResolvers = {
    Query: {
        ...FaqQueries,
    },
    Mutation: {
        ...FaqMutations,
    },
};

export default FaqResolvers;
