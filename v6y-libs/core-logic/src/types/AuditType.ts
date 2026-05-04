import { AuditHelpType } from './AuditHelpType.ts';
import { ModuleType } from './ModuleType.ts';

export interface AuditType {
    _id?: number;
    appId?: number;
    auditRunId?: number;
    moduleId?: number;
    auditHelpId?: number;
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
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    auditHelp?: AuditHelpType | null;
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    module?: ModuleType;
}
