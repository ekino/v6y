declare const ApplicationResolvers: {
    Query: {
        getApplicationDetailsInfoByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons").ApplicationType | null>;
        getApplicationDetailsAuditReportsByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons/src/database/models/AuditModel.ts").AuditModelType[] | null>;
        getApplicationDetailsEvolutionsByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons/src/database/models/EvolutionModel.ts").EvolutionModelType[] | null>;
        getApplicationDetailsDependenciesByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons/src/database/models/DependencyModel.ts").DependencyModelType[] | null>;
        getApplicationDetailsKeywordsByParams: (_: unknown, args: import("@v6y/commons").ApplicationType) => Promise<import("@v6y/commons/src/database/models/KeywordModel.ts").KeywordModelType[] | null>;
        getApplicationTotalByParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<number>;
        getApplicationListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons/src/database/models/ApplicationModel.ts").ApplicationModelType[]>;
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
            _id: number;
        } | null>;
    };
};
export default ApplicationResolvers;
