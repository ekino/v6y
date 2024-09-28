import { DataTypes, Model, Sequelize } from 'sequelize';

import { AuditHelpType } from '../../types/AuditHelpType.ts';
import { AuditType } from '../../types/AuditType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

const auditModelOptions = {};

export class AuditModelType extends Model<AuditType> implements AuditType {
    public _id!: number;
    public appId!: number;
    public type?: string;
    public category?: string;
    public subCategory?: string;
    public status?: string;
    public score?: number;
    public scoreUnit?: string;
    public extraInfos?: string;
    public auditHelp?: AuditHelpType;
    public module?: ModuleType;
}

const auditModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.TEXT,
    },
    category: {
        type: DataTypes.TEXT,
    },
    subCategory: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.TEXT,
    },
    score: {
        type: DataTypes.FLOAT,
    },
    scoreUnit: {
        type: DataTypes.TEXT,
    },
    extraInfos: {
        type: DataTypes.TEXT,
    },
    auditHelp: {
        type: DataTypes.JSON,
    },
    module: {
        type: DataTypes.JSON,
    },
};

const initializeAuditModel = (sequelize: Sequelize) => {
    AuditModelType.init(auditModelSchema, {
        sequelize,
        modelName: 'AuditReport',
        ...auditModelOptions,
    });
    return AuditModelType;
};

export default initializeAuditModel;
