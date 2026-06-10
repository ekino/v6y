import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import DependencyStatusHelpMutations from './DependencyStatusHelpMutations.ts';
import DependencyStatusHelpQueries from './DependencyStatusHelpQueries.ts';

/**
 * Schema-first GraphQL resolver for the Dependency Status Help domain.
 * Operation names match the SDL fragments declared in
 * src/types/dependency/status-help/*. Each handler delegates to the original
 * implementation so the runtime behavior stays identical to the previous
 * Apollo-on-Express setup.
 */
@Resolver()
export class DependencyStatusHelpResolver {
    @Query('getDependencyStatusHelpListByPageAndParams')
    getDependencyStatusHelpListByPageAndParams(
        @Args()
        args: Parameters<
            typeof DependencyStatusHelpQueries.getDependencyStatusHelpListByPageAndParams
        >[1],
    ) {
        return DependencyStatusHelpQueries.getDependencyStatusHelpListByPageAndParams(
            undefined,
            args,
        );
    }

    @Query('getDependencyStatusHelpDetailsByParams')
    getDependencyStatusHelpDetailsByParams(
        @Args()
        args: Parameters<
            typeof DependencyStatusHelpQueries.getDependencyStatusHelpDetailsByParams
        >[1],
    ) {
        return DependencyStatusHelpQueries.getDependencyStatusHelpDetailsByParams(undefined, args);
    }

    @Mutation('createOrEditDependencyStatusHelp')
    createOrEditDependencyStatusHelp(
        @Args()
        args: Parameters<typeof DependencyStatusHelpMutations.createOrEditDependencyStatusHelp>[1],
    ) {
        return DependencyStatusHelpMutations.createOrEditDependencyStatusHelp(undefined, args);
    }

    @Mutation('deleteDependencyStatusHelp')
    deleteDependencyStatusHelp(
        @Args()
        args: Parameters<typeof DependencyStatusHelpMutations.deleteDependencyStatusHelp>[1],
    ) {
        return DependencyStatusHelpMutations.deleteDependencyStatusHelp(undefined, args);
    }
}
