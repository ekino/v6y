import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import ApplicationMutations from './ApplicationMutations.ts';
import ApplicationQueries from './ApplicationQueries.ts';

/**
 * Schema-first GraphQL resolver for the Application domain. Operation names
 * match the SDL fragments declared in src/types/application/*. Each handler
 * delegates to the original implementation so the runtime behavior stays
 * identical to the previous Apollo-on-Express setup.
 */
@Resolver()
export class ApplicationResolver {
    @Query('getApplicationDetailsInfoByParams')
    getApplicationDetailsInfoByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationDetailsInfoByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationDetailsInfoByParams>[2],
    ) {
        return ApplicationQueries.getApplicationDetailsInfoByParams(undefined, args, context);
    }

    @Query('getApplicationDetailsAuditReportsByParams')
    getApplicationDetailsAuditReportsByParams(
        @Args()
        args: Parameters<typeof ApplicationQueries.getApplicationDetailsAuditReportsByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationDetailsAuditReportsByParams>[2],
    ) {
        return ApplicationQueries.getApplicationDetailsAuditReportsByParams(
            undefined,
            args,
            context,
        );
    }

    @Query('getApplicationDetailsEvolutionsByParams')
    getApplicationDetailsEvolutionsByParams(
        @Args()
        args: Parameters<typeof ApplicationQueries.getApplicationDetailsEvolutionsByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationDetailsEvolutionsByParams>[2],
    ) {
        return ApplicationQueries.getApplicationDetailsEvolutionsByParams(undefined, args, context);
    }

    @Query('getApplicationDetailsDependenciesByParams')
    getApplicationDetailsDependenciesByParams(
        @Args()
        args: Parameters<typeof ApplicationQueries.getApplicationDetailsDependenciesByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationDetailsDependenciesByParams>[2],
    ) {
        return ApplicationQueries.getApplicationDetailsDependenciesByParams(
            undefined,
            args,
            context,
        );
    }

    @Query('getApplicationDetailsKeywordsByParams')
    getApplicationDetailsKeywordsByParams(
        @Args()
        args: Parameters<typeof ApplicationQueries.getApplicationDetailsKeywordsByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationDetailsKeywordsByParams>[2],
    ) {
        return ApplicationQueries.getApplicationDetailsKeywordsByParams(undefined, args, context);
    }

    @Query('getApplicationTotalByParams')
    getApplicationTotalByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationTotalByParams>[1],
        @Context() context: Parameters<typeof ApplicationQueries.getApplicationTotalByParams>[2],
    ) {
        return ApplicationQueries.getApplicationTotalByParams(undefined, args, context);
    }

    @Query('getApplicationListByPageAndParams')
    getApplicationListByPageAndParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationListByPageAndParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationListByPageAndParams>[2],
    ) {
        return ApplicationQueries.getApplicationListByPageAndParams(undefined, args, context);
    }

    @Query('getApplicationStatsByParams')
    getApplicationStatsByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationStatsByParams>[1],
    ) {
        return ApplicationQueries.getApplicationStatsByParams(undefined, args);
    }

    @Query('getApplicationAuditRunsByParams')
    getApplicationAuditRunsByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationAuditRunsByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationAuditRunsByParams>[2],
    ) {
        return ApplicationQueries.getApplicationAuditRunsByParams(undefined, args, context);
    }

    @Query('getAllAuditRuns')
    getAllAuditRuns(
        @Args() args: Parameters<typeof ApplicationQueries.getAllAuditRuns>[1],
        @Context() context: Parameters<typeof ApplicationQueries.getAllAuditRuns>[2],
    ) {
        return ApplicationQueries.getAllAuditRuns(undefined, args, context);
    }

    @Query('getApplicationAuditHistoryByParams')
    getApplicationAuditHistoryByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationAuditHistoryByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationAuditHistoryByParams>[2],
    ) {
        return ApplicationQueries.getApplicationAuditHistoryByParams(undefined, args, context);
    }

    @Query('getApplicationAuditHistoryCountByParams')
    getApplicationAuditHistoryCountByParams(
        @Args()
        args: Parameters<typeof ApplicationQueries.getApplicationAuditHistoryCountByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationAuditHistoryCountByParams>[2],
    ) {
        return ApplicationQueries.getApplicationAuditHistoryCountByParams(undefined, args, context);
    }

    @Query('getApplicationLatestAuditRunByParams')
    getApplicationLatestAuditRunByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getApplicationLatestAuditRunByParams>[1],
        @Context()
        context: Parameters<typeof ApplicationQueries.getApplicationLatestAuditRunByParams>[2],
    ) {
        return ApplicationQueries.getApplicationLatestAuditRunByParams(undefined, args, context);
    }

    @Query('getAuditRunDetailsByParams')
    getAuditRunDetailsByParams(
        @Args() args: Parameters<typeof ApplicationQueries.getAuditRunDetailsByParams>[1],
        @Context() context: Parameters<typeof ApplicationQueries.getAuditRunDetailsByParams>[2],
    ) {
        return ApplicationQueries.getAuditRunDetailsByParams(undefined, args, context);
    }

    @Mutation('createOrEditApplication')
    createOrEditApplication(
        @Args() args: Parameters<typeof ApplicationMutations.createOrEditApplication>[1],
    ) {
        return ApplicationMutations.createOrEditApplication(undefined, args);
    }

    @Mutation('deleteApplication')
    deleteApplication(@Args() args: Parameters<typeof ApplicationMutations.deleteApplication>[1]) {
        return ApplicationMutations.deleteApplication(undefined, args);
    }

    @Mutation('triggerApplicationAnalysis')
    triggerApplicationAnalysis(
        @Args() args: Parameters<typeof ApplicationMutations.triggerApplicationAnalysis>[1],
    ) {
        return ApplicationMutations.triggerApplicationAnalysis(undefined, args);
    }
}
