import { DataTypes, Model } from 'sequelize';
const auditModelOptions = {};
export class AuditModelType extends Model {
    _id;
    appId;
    type;
    category;
    subCategory;
    status;
    score;
    scoreUnit;
    extraInfos;
    auditHelp;
    module;
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
const initializeAuditModel = (sequelize) => {
    AuditModelType.init(auditModelSchema, {
        sequelize,
        modelName: 'AuditReport',
        ...auditModelOptions,
    });
    return AuditModelType;
};
export default initializeAuditModel;
