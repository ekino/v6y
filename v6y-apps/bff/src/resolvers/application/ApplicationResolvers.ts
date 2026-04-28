import ApplicationMutations from './ApplicationMutations.ts';
import ApplicationQueries from './ApplicationQueries.ts';
import SonarQubeMetricsResolvers from './SonarQubeMetricsResolvers.ts';

const ApplicationResolvers = {
    Query: {
        ...ApplicationQueries,
        ...SonarQubeMetricsResolvers,
    },
    Mutation: {
        ...ApplicationMutations,
    },
};

export default ApplicationResolvers;
