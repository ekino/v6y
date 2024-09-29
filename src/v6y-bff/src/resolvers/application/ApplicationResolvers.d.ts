declare const ApplicationResolvers: {
    Query: {
        getApplicationDetailsInfoByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons").ApplicationType | null>;
        getApplicationDetailsAuditReportsByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons").AuditType[] | null>;
        getApplicationDetailsEvolutionsByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons").EvolutionType[] | null>;
        getApplicationDetailsDependenciesByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons").DependencyType[] | null>;
        getApplicationDetailsKeywordsByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons").KeywordType[] | null>;
        getApplicationTotalByParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<number>;
        getApplicationListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").ApplicationType[]>;
        getApplicationStatsByParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").KeywordStatsType[] | null>;
    };
    Mutation: {
        createOrEditApplication: (_: unknown, params: {
            applicationInput: import("@v6y/commons").ApplicationInputType;
        }) => Promise<{
            _id: number;
        } | null>;
        deleteApplication: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: string;
        } | null>;
    };
};
export default ApplicationResolvers;
