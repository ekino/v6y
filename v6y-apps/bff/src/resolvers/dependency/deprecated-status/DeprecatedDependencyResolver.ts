import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import DeprecatedDependencyMutations from './DeprecatedDependencyMutations.ts';
import DeprecatedDependencyQueries from './DeprecatedDependencyQueries.ts';

/**
 * Schema-first GraphQL resolver for the Deprecated Dependency domain. Operation
 * names match the SDL fragments declared in src/types/dependency/deprecated-status/*.
 * Each handler delegates to the original implementation so the runtime behavior
 * stays identical to the previous Apollo-on-Express setup.
 */
@Resolver()
export class DeprecatedDependencyResolver {
    @Query('getDeprecatedDependencyListByPageAndParams')
    getDeprecatedDependencyListByPageAndParams(
        @Args()
        args: Parameters<
            typeof DeprecatedDependencyQueries.getDeprecatedDependencyListByPageAndParams
        >[1],
    ) {
        return DeprecatedDependencyQueries.getDeprecatedDependencyListByPageAndParams(
            undefined,
            args,
        );
    }

    @Query('getDeprecatedDependencyDetailsByParams')
    getDeprecatedDependencyDetailsByParams(
        @Args()
        args: Parameters<
            typeof DeprecatedDependencyQueries.getDeprecatedDependencyDetailsByParams
        >[1],
    ) {
        return DeprecatedDependencyQueries.getDeprecatedDependencyDetailsByParams(undefined, args);
    }

    @Mutation('createOrEditDeprecatedDependency')
    createOrEditDeprecatedDependency(
        @Args()
        args: Parameters<typeof DeprecatedDependencyMutations.createOrEditDeprecatedDependency>[1],
    ) {
        return DeprecatedDependencyMutations.createOrEditDeprecatedDependency(undefined, args);
    }

    @Mutation('deleteDeprecatedDependency')
    deleteDeprecatedDependency(
        @Args()
        args: Parameters<typeof DeprecatedDependencyMutations.deleteDeprecatedDependency>[1],
    ) {
        return DeprecatedDependencyMutations.deleteDeprecatedDependency(undefined, args);
    }
}
