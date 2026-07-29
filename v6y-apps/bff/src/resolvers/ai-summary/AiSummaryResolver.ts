import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import AiSummaryMutations from './AiSummaryMutations.ts';
import AiSummaryQueries from './AiSummaryQueries.ts';

/**
 * Schema-first GraphQL resolver for the AI Summary domain. Operation names
 * match the SDL fragments declared in src/types/ai-summary/*.
 */
@Resolver()
export class AiSummaryResolver {
    @Query('getApplicationAiSummaryByParams')
    getApplicationAiSummaryByParams(
        @Args() args: Parameters<typeof AiSummaryQueries.getApplicationAiSummaryByParams>[1],
        @Context()
        context: Parameters<typeof AiSummaryQueries.getApplicationAiSummaryByParams>[2],
    ) {
        return AiSummaryQueries.getApplicationAiSummaryByParams(undefined, args, context);
    }

    @Mutation('generateApplicationAiSummary')
    generateApplicationAiSummary(
        @Args() args: Parameters<typeof AiSummaryMutations.generateApplicationAiSummary>[1],
        @Context()
        context: Parameters<typeof AiSummaryMutations.generateApplicationAiSummary>[2],
    ) {
        return AiSummaryMutations.generateApplicationAiSummary(undefined, args, context);
    }
}
