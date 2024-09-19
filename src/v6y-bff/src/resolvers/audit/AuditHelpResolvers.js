import AuditHelpMutations from './AuditHelpMutations.js';
import AuditHelpQueries from './AuditHelpQueries.js';

const AuditHelpResolvers = {
    Query: {
        ...AuditHelpQueries,
    },
    Mutation: {
        ...AuditHelpMutations,
    },
};

export default AuditHelpResolvers;
