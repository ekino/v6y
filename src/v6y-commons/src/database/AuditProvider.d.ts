import { AuditType } from '../types/AuditType.ts';
import { AuditModelType } from './models/AuditModel.ts';
declare const AuditProvider: {
    createAudit: (audit: AuditType) => Promise<AuditModelType | null>;
    insertAuditList: (auditList: AuditType[] | null) => Promise<boolean>;
    editAudit: (audit: AuditType) => Promise<{
        _id: number;
    } | null>;
    deleteAudit: ({ _id }: AuditType) => Promise<{
        _id: number;
    } | null>;
    deleteAuditList: () => Promise<boolean>;
    getAuditListByPageAndParams: ({ appId }: AuditType) => Promise<AuditType[]>;
};
export default AuditProvider;
