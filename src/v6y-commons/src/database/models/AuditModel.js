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
    scorePercent: {
        type: DataTypes.FLOAT,
    },
    scoreUnit: {
        type: DataTypes.TEXT,
    },
    module: DataTypes.JSON,
    auditHelp: DataTypes.JSON,
};

const auditModelOptions = {
    indexes: [{ unique: true, fields: ['type', 'category', 'subCategory'] }],
};

const AuditModel = {
    name: 'AuditReport',
    schema: auditModelSchema,
    options: auditModelOptions,
};

export default AuditModel;
