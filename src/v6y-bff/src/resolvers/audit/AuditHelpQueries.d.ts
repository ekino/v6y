import { AuditHelpType, SearchQueryType } from '@v6y/commons';
declare const AuditHelpQueries: {
    getAuditHelpListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<AuditHelpType[]>;
    getAuditHelpDetailsByParams: (_: unknown, args: AuditHelpType) => Promise<AuditHelpType | null>;
};
export default AuditHelpQueries;
