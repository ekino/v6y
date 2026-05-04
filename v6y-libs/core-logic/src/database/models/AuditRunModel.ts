import { DataTypes, Model, Sequelize } from 'sequelize';

import { AuditRunType } from '../../types/AuditRunType.ts';

export class AuditRunModelType extends Model<AuditRunType> implements AuditRunType {
    declare _id: number;
    declare appId: number;
    declare triggeredAt?: Date;
    declare completedAt?: Date;
    declare status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    declare triggeredBy?: string;
}

const auditRunSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    triggeredAt: {
        type: DataTypes.DATE,
    },
    completedAt: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING',
    },
    triggeredBy: {
        type: DataTypes.TEXT,
    },
};

const initializeAuditRunModel = (sequelize: Sequelize) => {
    AuditRunModelType.init(auditRunSchema, {
        sequelize,
        modelName: 'AuditRun',
    });

    return AuditRunModelType;
};

export default initializeAuditRunModel;
