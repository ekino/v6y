import { AuditHelpType, SearchQueryType } from '@v6y/commons';
declare const AuditHelpMutations: {
    createOrEditAuditHelp: (_: unknown, params: {
        auditHelpInput: AuditHelpType;
    }) => Promise<AuditHelpType | null>;
    deleteAuditHelp: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: number;
    } | null>;
};
export default AuditHelpMutations;
