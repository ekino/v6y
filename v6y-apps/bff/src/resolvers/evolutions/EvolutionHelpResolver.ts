import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import EvolutionHelpMutations from './EvolutionHelpMutations.ts';
import EvolutionHelpQueries from './EvolutionHelpQueries.ts';

/**
 * Schema-first GraphQL resolver for the Evolution Help domain. Operation names
 * match the SDL fragments declared in src/types/evolution/help/*. Each handler
 * delegates to the original implementation so the runtime behavior stays
 * identical to the previous Apollo-on-Express setup.
 */
@Resolver()
export class EvolutionHelpResolver {
    @Query('getEvolutionHelpListByPageAndParams')
    getEvolutionHelpListByPageAndParams(
        @Args()
        args: Parameters<typeof EvolutionHelpQueries.getEvolutionHelpListByPageAndParams>[1],
    ) {
        return EvolutionHelpQueries.getEvolutionHelpListByPageAndParams(undefined, args);
    }

    @Query('getEvolutionHelpDetailsByParams')
    getEvolutionHelpDetailsByParams(
        @Args() args: Parameters<typeof EvolutionHelpQueries.getEvolutionHelpDetailsByParams>[1],
    ) {
        return EvolutionHelpQueries.getEvolutionHelpDetailsByParams(undefined, args);
    }

    @Query('getEvolutionHelpStatus')
    getEvolutionHelpStatus(
        @Args() args: Parameters<typeof EvolutionHelpQueries.getEvolutionHelpStatus>[1],
    ) {
        return EvolutionHelpQueries.getEvolutionHelpStatus(undefined, args);
    }

    @Mutation('createOrEditEvolutionHelp')
    createOrEditEvolutionHelp(
        @Args() args: Parameters<typeof EvolutionHelpMutations.createOrEditEvolutionHelp>[1],
    ) {
        return EvolutionHelpMutations.createOrEditEvolutionHelp(undefined, args);
    }

    @Mutation('deleteEvolutionHelp')
    deleteEvolutionHelp(
        @Args() args: Parameters<typeof EvolutionHelpMutations.deleteEvolutionHelp>[1],
    ) {
        return EvolutionHelpMutations.deleteEvolutionHelp(undefined, args);
    }
}
