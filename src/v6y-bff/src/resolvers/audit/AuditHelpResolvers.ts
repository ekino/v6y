import AuditHelpMutations from './AuditHelpMutations.ts';
import AuditHelpQueries from './AuditHelpQueries.ts';

const AuditHelpResolvers = {
    Query: {
        ...AuditHelpQueries,
    },
    Mutation: {
        ...AuditHelpMutations,
    },
};

export default AuditHelpResolvers;
