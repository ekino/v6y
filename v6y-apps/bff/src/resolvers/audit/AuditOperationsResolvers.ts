import AuditOperationsMutations from './AuditOperationsMutations.ts';
import AuditOperationsQueries from './AuditOperationsQueries.ts';

const AuditOperationsResolvers = {
    Query: {
        ...AuditOperationsQueries,
    },
    Mutation: {
        ...AuditOperationsMutations,
    },
};

export default AuditOperationsResolvers;
