import { DataTypes } from 'sequelize';

const auditModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    module: DataTypes.JSON,
    auditHelp: DataTypes.JSON,
};

const auditModelOptions = {};

const AuditModel = {
    name: 'AuditReport',
    schema: auditModelSchema,
    options: auditModelOptions,
};

export default AuditModel;
