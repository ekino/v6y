declare const VitalityResolvers: {
    Query: {
        getDeprecatedDependencyListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").DeprecatedDependencyType[]>;
        getDeprecatedDependencyDetailsByParams: (_: unknown, args: import("@v6y/commons").DeprecatedDependencyType) => Promise<import("@v6y/commons").DeprecatedDependencyType | null>;
        getDependencyStatusHelpListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").DependencyStatusHelpType[]>;
        getDependencyStatusHelpDetailsByParams: (_: unknown, args: import("@v6y/commons").DependencyStatusHelpType) => Promise<import("@v6y/commons").DependencyStatusHelpType | null>;
        getAuditHelpListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").AuditHelpType[]>;
        getAuditHelpDetailsByParams: (_: unknown, args: import("@v6y/commons").AuditHelpType) => Promise<import("@v6y/commons").AuditHelpType | null>;
        getEvolutionHelpListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").EvolutionHelpType[]>;
        getEvolutionHelpDetailsByParams: (_: unknown, args: import("@v6y/commons").EvolutionHelpType) => Promise<import("@v6y/commons").EvolutionHelpType | null>;
        getEvolutionHelpStatus: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").EvolutionHelpStatusType[] | null>;
        getNotificationListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").NotificationType[]>;
        getNotificationDetailsByParams: (_: unknown, args: import("@v6y/commons").NotificationType) => Promise<import("@v6y/commons").NotificationType | null>;
        getFaqListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons").FaqType[]>;
        getFaqDetailsByParams: (_: unknown, args: import("@v6y/commons").FaqType) => Promise<import("@v6y/commons").FaqType | null>;
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
        createOrEditDeprecatedDependency: (_: unknown, params: {
            deprecatedDependencyInput: import("@v6y/commons").DeprecatedDependencyType;
        }) => Promise<import("@v6y/commons/src/database/models/DeprecatedDependencyModel.ts").DeprecatedDependencyModelType | {
            _id: number;
        } | null>;
        deleteDeprecatedDependency: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
        createOrEditDependencyStatusHelp: (_: unknown, params: {
            dependencyStatusHelpInput: import("@v6y/commons").DependencyStatusHelpInputType;
        }) => Promise<import("@v6y/commons/src/database/models/DependencyStatusHelpModel.ts").DependencyStatusHelpModelType | {
            _id: number;
        } | null>;
        deleteDependencyStatusHelp: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
        createOrEditAuditHelp: (_: unknown, params: {
            auditHelpInput: import("@v6y/commons").AuditHelpType;
        }) => Promise<import("@v6y/commons").AuditHelpType | null>;
        deleteAuditHelp: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
        createOrEditEvolutionHelp: (_: unknown, params: {
            evolutionHelpInput: import("@v6y/commons").EvolutionHelpInputType;
        }) => Promise<import("@v6y/commons/src/database/models/EvolutionHelpModel.ts").EvolutionHelpModelType | {
            _id: number;
        } | null>;
        deleteEvolutionHelp: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
        createOrEditNotification: (_: unknown, params: {
            notificationInput: import("@v6y/commons").NotificationInputType;
        }) => Promise<import("@v6y/commons/src/database/models/NotificationModel.ts").NotificationModelType | {
            _id: number;
        } | null>;
        deleteNotification: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
        createOrEditFaq: (_: unknown, params: {
            faqInput: import("@v6y/commons").FaqInputType;
        }) => Promise<import("@v6y/commons/src/database/models/FaqModel.ts").FaqModelType | {
            _id: number;
        } | null>;
        deleteFaq: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
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
export default VitalityResolvers;
