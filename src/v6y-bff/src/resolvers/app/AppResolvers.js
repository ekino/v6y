import AppMutations from './AppMutations.js';
import AppQueries from './AppQueries.js';

const AppResolvers = {
    Query: {
        ...AppQueries,
    },
    Mutation: {
        ...AppMutations,
    },
};

export default AppResolvers;
