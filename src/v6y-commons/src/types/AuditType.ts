import { AuditHelpType } from './AuditHelpType';
import { ModuleType } from './ModuleType';

export interface AuditType {
    _id?: number;
    appId?: number;
    type?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    score?: number;
    scoreUnit?: string;
    extraInfos?: string;
    auditHelp?: AuditHelpType | null;
    module?: ModuleType;
}
