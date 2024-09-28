import { DataTypes, Model } from 'sequelize';
export class AuditHelpModelType extends Model {
    _id;
    category;
    title;
    description;
    explanation;
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
const initializeAuditHelpModel = (sequelize) => {
    AuditHelpModelType.init(auditHelpModelSchema, {
        sequelize,
        modelName: 'AuditHelp',
        ...auditHelpModelOptions,
    });
    return AuditHelpModelType;
};
export default initializeAuditHelpModel;
