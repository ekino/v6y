import { AuditHelpType } from './AuditHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface AuditType {
    _id?: number;
    appId?: number;
    type?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    score?: number | undefined | null;
    scoreUnit?: string;
    extraInfos?: string;
    auditHelp?: AuditHelpType | null;
    module?: ModuleType;
}
