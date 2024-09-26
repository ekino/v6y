"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditHelpModelType = void 0;
const sequelize_1 = require("sequelize");
class AuditHelpModelType extends sequelize_1.Model {
    _id;
    category;
    title;
    description;
    explanation;
}
exports.AuditHelpModelType = AuditHelpModelType;
const auditHelpModelSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    explanation: {
        type: sequelize_1.DataTypes.TEXT,
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
exports.default = initializeAuditHelpModel;
