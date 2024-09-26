"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyModelType = void 0;
const sequelize_1 = require("sequelize");
class DependencyModelType extends sequelize_1.Model {
    _id;
    appId;
    type;
    name;
    version;
    recommendedVersion;
    status;
    statusHelp;
    module;
}
exports.DependencyModelType = DependencyModelType;
const dependencyModelSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.TEXT,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
    },
    version: {
        type: sequelize_1.DataTypes.TEXT,
    },
    recommendedVersion: {
        type: sequelize_1.DataTypes.TEXT,
    },
    status: {
        type: sequelize_1.DataTypes.TEXT,
    },
    statusHelp: {
        type: sequelize_1.DataTypes.JSON,
    },
    module: {
        type: sequelize_1.DataTypes.JSON,
    },
};
const dependencyModelOptions = {};
const initializeDependencyModel = (sequelize) => {
    DependencyModelType.init(dependencyModelSchema, {
        sequelize,
        modelName: 'Dependency',
        ...dependencyModelOptions,
    });
    return DependencyModelType;
};
exports.default = initializeDependencyModel;
