import ApplicationMutations from './ApplicationMutations.js';
import ApplicationQueries from './ApplicationQueries.js';

const ApplicationResolvers = {
    Query: {
        ...ApplicationQueries,
    },
    Mutation: {
        ...ApplicationMutations,
    },
};

export default ApplicationResolvers;
