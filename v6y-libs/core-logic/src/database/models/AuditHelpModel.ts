import { DataTypes, Model, Sequelize } from 'sequelize';

import { AuditHelpType } from '../../types/AuditHelpType.ts';

export class AuditHelpModelType extends Model<AuditHelpType> implements AuditHelpType {
    declare _id: number;
    declare category: string;
    declare title: string;
    declare description: string;
    declare explanation?: string;
}

const auditHelpModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    explanation: {
        type: DataTypes.TEXT,
    },
};

const auditHelpModelOptions = {
    indexes: [{ unique: true, fields: ['category', 'title'] }],
};

const initializeAuditHelpModel = (sequelize: Sequelize) => {
    AuditHelpModelType.init(auditHelpModelSchema, {
        sequelize,
        modelName: 'AuditHelp',
        ...auditHelpModelOptions,
    });
    return AuditHelpModelType;
};

export default initializeAuditHelpModel;
