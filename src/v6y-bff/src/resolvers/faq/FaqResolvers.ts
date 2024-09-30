import FaqMutations from './FaqMutations.ts';
import FaqQueries from './FaqQueries.ts';

const FaqResolvers = {
    Query: {
        ...FaqQueries,
    },
    Mutation: {
        ...FaqMutations,
    },
};

export default FaqResolvers;
