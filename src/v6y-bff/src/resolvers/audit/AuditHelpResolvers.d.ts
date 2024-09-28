declare const AuditHelpResolvers: {
    Query: {
        getAuditHelpListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons/src/database/models/AuditHelpModel.ts").AuditHelpModelType[]>;
        getAuditHelpDetailsByParams: (_: unknown, args: import("@v6y/commons").AuditHelpType) => Promise<import("@v6y/commons").AuditHelpType | null>;
    };
    Mutation: {
        createOrEditAuditHelp: (_: unknown, params: {
            auditHelpInput: import("@v6y/commons").AuditHelpType;
        }) => Promise<import("@v6y/commons").AuditHelpType | null>;
        deleteAuditHelp: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
    };
};
export default AuditHelpResolvers;
