import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import AccountMutations from './AccountMutations.ts';
import AccountQueries from './AccountQueries.ts';

/**
 * Schema-first GraphQL resolver for the Account domain. Operation names match
 * the SDL fragments declared in src/types/account/*. Each handler delegates to
 * the original implementation so the runtime behavior stays identical to the
 * previous Apollo-on-Express setup.
 */
@Resolver()
export class AccountResolver {
    @Query('getAccountListByPageAndParams')
    getAccountListByPageAndParams(
        @Args() args: Parameters<typeof AccountQueries.getAccountListByPageAndParams>[1],
    ) {
        return AccountQueries.getAccountListByPageAndParams(undefined, args);
    }

    @Query('getAccountDetailsByParams')
    getAccountDetailsByParams(
        @Args() args: Parameters<typeof AccountQueries.getAccountDetailsByParams>[1],
    ) {
        return AccountQueries.getAccountDetailsByParams(undefined, args);
    }

    @Query('loginAccount')
    loginAccount(@Args() args: Parameters<typeof AccountQueries.loginAccount>[1]) {
        return AccountQueries.loginAccount(undefined, args);
    }

    @Mutation('createOrEditAccount')
    createOrEditAccount(
        @Args() args: Parameters<typeof AccountMutations.createOrEditAccount>[1],
        @Context() context: Parameters<typeof AccountMutations.createOrEditAccount>[2],
    ) {
        return AccountMutations.createOrEditAccount(undefined, args, context);
    }

    @Mutation('updateAccountPassword')
    updateAccountPassword(
        @Args() args: Parameters<typeof AccountMutations.updateAccountPassword>[1],
        @Context() context: Parameters<typeof AccountMutations.updateAccountPassword>[2],
    ) {
        return AccountMutations.updateAccountPassword(undefined, args, context);
    }

    @Mutation('deleteAccount')
    deleteAccount(
        @Args() args: Parameters<typeof AccountMutations.deleteAccount>[1],
        @Context() context: Parameters<typeof AccountMutations.deleteAccount>[2],
    ) {
        return AccountMutations.deleteAccount(undefined, args, context);
    }
}
