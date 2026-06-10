import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import AuditHelpMutations from './AuditHelpMutations.ts';
import AuditHelpQueries from './AuditHelpQueries.ts';

/**
 * Schema-first GraphQL resolver for the Audit Help domain. Operation names
 * match the SDL fragments declared in src/types/audit/help/*. Each handler
 * delegates to the original implementation so the runtime behavior stays
 * identical to the previous Apollo-on-Express setup.
 */
@Resolver()
export class AuditHelpResolver {
    @Query('getAuditHelpListByPageAndParams')
    getAuditHelpListByPageAndParams(
        @Args() args: Parameters<typeof AuditHelpQueries.getAuditHelpListByPageAndParams>[1],
    ) {
        return AuditHelpQueries.getAuditHelpListByPageAndParams(undefined, args);
    }

    @Query('getAuditHelpDetailsByParams')
    getAuditHelpDetailsByParams(
        @Args() args: Parameters<typeof AuditHelpQueries.getAuditHelpDetailsByParams>[1],
    ) {
        return AuditHelpQueries.getAuditHelpDetailsByParams(undefined, args);
    }

    @Mutation('createOrEditAuditHelp')
    createOrEditAuditHelp(
        @Args() args: Parameters<typeof AuditHelpMutations.createOrEditAuditHelp>[1],
    ) {
        return AuditHelpMutations.createOrEditAuditHelp(undefined, args);
    }

    @Mutation('deleteAuditHelp')
    deleteAuditHelp(@Args() args: Parameters<typeof AuditHelpMutations.deleteAuditHelp>[1]) {
        return AuditHelpMutations.deleteAuditHelp(undefined, args);
    }
}
