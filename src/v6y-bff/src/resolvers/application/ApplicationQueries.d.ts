import { ApplicationType, SearchQueryType } from '@v6y/commons';
declare const ApplicationQueries: {
    getApplicationDetailsInfoByParams: (_: unknown, args: ApplicationType) => Promise<ApplicationType | null>;
    getApplicationDetailsAuditReportsByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons").AuditType[] | null>;
    getApplicationDetailsEvolutionsByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons").EvolutionType[] | null>;
    getApplicationDetailsDependenciesByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons").DependencyType[] | null>;
    getApplicationDetailsKeywordsByParams: (_: unknown, args: ApplicationType) => Promise<import("@v6y/commons").KeywordType[] | null>;
    getApplicationTotalByParams: (_: unknown, args: SearchQueryType) => Promise<number>;
    getApplicationListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<ApplicationType[]>;
    getApplicationStatsByParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons").KeywordStatsType[] | null>;
};
export default ApplicationQueries;
