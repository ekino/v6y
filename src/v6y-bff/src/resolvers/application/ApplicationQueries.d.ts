import { ApplicationType, SearchQueryType } from '@v6y/commons';
declare const ApplicationQueries: {
    getApplicationDetailsInfoByParams: (_: unknown, args: ApplicationType) => Promise<ApplicationType | null>;
    getApplicationDetailsAuditReportsByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons/src/database/models/AuditModel.ts").AuditModelType[] | null>;
    getApplicationDetailsEvolutionsByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons/src/database/models/EvolutionModel.ts").EvolutionModelType[] | null>;
    getApplicationDetailsDependenciesByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons/src/database/models/DependencyModel.ts").DependencyModelType[] | null>;
    getApplicationDetailsKeywordsByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons/src/database/models/KeywordModel.ts").KeywordModelType[] | null>;
    getApplicationTotalByParams: (_: unknown, args: SearchQueryType) => Promise<number>;
    getApplicationListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/ApplicationModel.ts").ApplicationModelType[]>;
    getApplicationStatsByParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons").KeywordStatsType[] | null>;
};
export default ApplicationQueries;
