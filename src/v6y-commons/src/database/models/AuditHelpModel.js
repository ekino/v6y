import { DataTypes } from 'sequelize';

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

const AuditHelpModelModel = {
    name: 'AuditHelp',
    schema: auditHelpModelSchema,
    options: auditHelpModelOptions,
};

export default AuditHelpModelModel;
