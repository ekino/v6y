import { AuditHelpType } from './AuditHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface AuditType {
    _id?: number;
    appId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    type?: string;
    category?: string;
    subCategory?: string;
    auditStatus?: string;
    score?: number | null;
    scoreStatus?: string | null;
    scoreUnit?: string;
    extraInfos?: string;
    auditHelp?: AuditHelpType | null;
    module?: ModuleType;
}
