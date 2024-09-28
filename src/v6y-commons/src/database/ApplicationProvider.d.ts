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
    getApplicationDetailsEvolutionsByParams: ({ _id }: ApplicationType) => Promise<import("./models/EvolutionModel.ts").EvolutionModelType[] | null>;
    getApplicationDetailsDependenciesByParams: ({ _id }: ApplicationType) => Promise<import("./models/DependencyModel.ts").DependencyModelType[] | null>;
    getApplicationDetailsAuditReportsByParams: ({ _id }: ApplicationType) => Promise<import("./models/AuditModel.ts").AuditModelType[] | null>;
    getApplicationDetailsKeywordsByParams: ({ _id }: ApplicationType) => Promise<import("./models/KeywordModel.ts").KeywordModelType[] | null>;
    getApplicationListByPageAndParams: ({ searchText, keywords, offset, limit, where, }: SearchQueryType) => Promise<ApplicationModelType[]>;
    getApplicationTotalByParams: ({ searchText, keywords }: SearchQueryType) => Promise<number>;
    getApplicationStatsByParams: ({ keywords }: SearchQueryType) => Promise<import("../index.ts").KeywordStatsType[] | null>;
};
export default ApplicationProvider;
