import { AuditHelpType, SearchQueryType } from '@v6y/commons';
declare const AuditHelpQueries: {
    getAuditHelpListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/AuditHelpModel.ts").AuditHelpModelType[]>;
    getAuditHelpDetailsByParams: (_: unknown, args: AuditHelpType) => Promise<AuditHelpType | null>;
};
export default AuditHelpQueries;
