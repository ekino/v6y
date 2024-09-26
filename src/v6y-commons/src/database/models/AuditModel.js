"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditModelType = void 0;
const sequelize_1 = require("sequelize");
const auditModelOptions = {};
class AuditModelType extends sequelize_1.Model {
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
exports.AuditModelType = AuditModelType;
const auditModelSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.TEXT,
    },
    category: {
        type: sequelize_1.DataTypes.TEXT,
    },
    subCategory: {
        type: sequelize_1.DataTypes.TEXT,
    },
    status: {
        type: sequelize_1.DataTypes.TEXT,
    },
    score: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    scoreUnit: {
        type: sequelize_1.DataTypes.TEXT,
    },
    extraInfos: {
        type: sequelize_1.DataTypes.TEXT,
    },
    auditHelp: {
        type: sequelize_1.DataTypes.JSON,
    },
    module: {
        type: sequelize_1.DataTypes.JSON,
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
exports.default = initializeAuditModel;
