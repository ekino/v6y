import AccountMutations from './AccountMutations.ts';
import AccountQueries from './AccountQueries.ts';

const AccountResolvers = {
    Query: {
        ...AccountQueries,
    },
    Mutation: {
        ...AccountMutations,
    },
};

export default AccountResolvers;
