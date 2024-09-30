import ApplicationMutations from './ApplicationMutations.ts';
import ApplicationQueries from './ApplicationQueries.ts';

const ApplicationResolvers = {
    Query: {
        ...ApplicationQueries,
    },
    Mutation: {
        ...ApplicationMutations,
    },
};

export default ApplicationResolvers;
