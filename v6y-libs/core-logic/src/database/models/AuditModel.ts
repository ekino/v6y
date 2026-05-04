import { DataTypes, Model, Sequelize } from 'sequelize';

import { AuditHelpType } from '../../types/AuditHelpType.ts';
import { AuditType } from '../../types/AuditType.ts';
import { ModuleType } from '../../types/ModuleType.ts';

const auditModelOptions = {};

export class AuditModelType extends Model<AuditType> implements AuditType {
    declare _id: number;
    declare appId: number;
    declare dateStart?: Date;
    declare dateEnd?: Date;
    declare type?: string;
    declare category?: string;
    declare subCategory?: string;
    declare auditStatus: string;
    declare score: number | null;
    declare scoreStatus: string | null;
    declare scoreUnit?: string;
    declare extraInfos?: string;
    declare auditHelp?: AuditHelpType;
    declare module?: ModuleType;
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
    dateStart: {
        type: DataTypes.DATE,
    },
    dateEnd: {
        type: DataTypes.DATE,
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
    auditStatus: {
        type: DataTypes.TEXT,
    },
    score: {
        type: DataTypes.FLOAT,
    },
    scoreStatus: {
        type: DataTypes.TEXT,
    },
    scoreUnit: {
        type: DataTypes.TEXT,
    },
    extraInfos: {
        type: DataTypes.TEXT,
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
