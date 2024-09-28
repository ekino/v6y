import { Model, Sequelize } from 'sequelize';
import { AuditHelpType } from '../../types/AuditHelpType.ts';
import { AuditType } from '../../types/AuditType.ts';
import { ModuleType } from '../../types/ModuleType.ts';
export declare class AuditModelType extends Model<AuditType> implements AuditType {
    _id: number;
    appId: number;
    type?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    score?: number;
    scoreUnit?: string;
    extraInfos?: string;
    auditHelp?: AuditHelpType;
    module?: ModuleType;
}
declare const initializeAuditModel: (sequelize: Sequelize) => typeof AuditModelType;
export default initializeAuditModel;
