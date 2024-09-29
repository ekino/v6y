import { ApplicationInputType, ApplicationType } from '../types/ApplicationType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { ApplicationModelType } from './models/ApplicationModel.ts';
declare const ApplicationProvider: {
    createFormApplication: (application: ApplicationInputType) => Promise<ApplicationModelType | null>;
    editFormApplication: (application: ApplicationInputType) => Promise<{
        _id: number;
    } | null>;
    editApplication: (application: ApplicationType) => Promise<{
        _id: number;
    } | null>;
    deleteApplication: ({ _id }: ApplicationType) => Promise<{
        _id: number;
    } | null | undefined>;
    deleteApplicationList: () => Promise<boolean>;
    getApplicationDetailsInfoByParams: ({ _id }: ApplicationType) => Promise<ApplicationType | null>;
    getApplicationDetailsEvolutionsByParams: ({ _id }: ApplicationType) => Promise<import("../index.ts").EvolutionType[] | null>;
    getApplicationDetailsDependenciesByParams: ({ _id }: ApplicationType) => Promise<import("../index.ts").DependencyType[] | null>;
    getApplicationDetailsAuditReportsByParams: ({ _id }: ApplicationType) => Promise<import("../index.ts").AuditType[] | null>;
    getApplicationDetailsKeywordsByParams: ({ _id }: ApplicationType) => Promise<import("../index.ts").KeywordType[] | null>;
    getApplicationListByPageAndParams: ({ searchText, keywords, offset, limit, where, }: SearchQueryType) => Promise<ApplicationType[]>;
    getApplicationTotalByParams: ({ searchText, keywords }: SearchQueryType) => Promise<number>;
    getApplicationStatsByParams: ({ keywords }: SearchQueryType) => Promise<import("../index.ts").KeywordStatsType[] | null>;
};
export default ApplicationProvider;
