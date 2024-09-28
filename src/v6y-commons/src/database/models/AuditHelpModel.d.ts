import { Model, Sequelize } from 'sequelize';
import { AuditHelpType } from '../../types/AuditHelpType.ts';
export declare class AuditHelpModelType extends Model<AuditHelpType> implements AuditHelpType {
    _id: number;
    category: string;
    title: string;
    description: string;
    explanation?: string;
}
declare const initializeAuditHelpModel: (sequelize: Sequelize) => typeof AuditHelpModelType;
export default initializeAuditHelpModel;
