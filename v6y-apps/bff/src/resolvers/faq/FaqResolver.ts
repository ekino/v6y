import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import FaqMutations from './FaqMutations.ts';
import FaqQueries from './FaqQueries.ts';

/**
 * Schema-first GraphQL resolver for the FAQ domain. Operation names match the
 * SDL fragments declared in src/types/faq/*. Each handler delegates to the
 * original implementation so the runtime behavior stays identical to the
 * previous Apollo-on-Express setup.
 */
@Resolver()
export class FaqResolver {
    @Query('getFaqListByPageAndParams')
    getFaqListByPageAndParams(
        @Args() args: Parameters<typeof FaqQueries.getFaqListByPageAndParams>[1],
    ) {
        return FaqQueries.getFaqListByPageAndParams(undefined, args);
    }

    @Query('getFaqDetailsByParams')
    getFaqDetailsByParams(@Args() args: Parameters<typeof FaqQueries.getFaqDetailsByParams>[1]) {
        return FaqQueries.getFaqDetailsByParams(undefined, args);
    }

    @Mutation('createOrEditFaq')
    createOrEditFaq(@Args() args: Parameters<typeof FaqMutations.createOrEditFaq>[1]) {
        return FaqMutations.createOrEditFaq(undefined, args);
    }

    @Mutation('deleteFaq')
    deleteFaq(@Args() args: Parameters<typeof FaqMutations.deleteFaq>[1]) {
        return FaqMutations.deleteFaq(undefined, args);
    }
}
