import { AuditHelpType } from '../types/AuditHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { AuditHelpModelType } from './models/AuditHelpModel.ts';
declare const AuditHelpProvider: {
    initDefaultData: () => Promise<boolean>;
    createAuditHelp: (auditHelp: AuditHelpType) => Promise<AuditHelpType | null>;
    editAuditHelp: (auditHelp: AuditHelpType) => Promise<{
        _id: number;
    } | null>;
    deleteAuditHelp: ({ _id }: AuditHelpType) => Promise<{
        _id: number;
    } | null>;
    deleteAuditHelpList: () => Promise<boolean>;
    getAuditHelpListByPageAndParams: ({ start, limit, sort }: SearchQueryType) => Promise<AuditHelpModelType[]>;
    getAuditHelpDetailsByParams: ({ _id, category }: AuditHelpType) => Promise<AuditHelpType | null>;
};
export default AuditHelpProvider;
