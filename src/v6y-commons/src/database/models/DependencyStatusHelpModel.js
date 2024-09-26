"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyStatusHelpModelType = void 0;
const sequelize_1 = require("sequelize");
class DependencyStatusHelpModelType extends sequelize_1.Model {
    _id;
    category;
    title;
    description;
    links;
}
exports.DependencyStatusHelpModelType = DependencyStatusHelpModelType;
const dependencyStatusHelpModelSchema = {
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
    },
    links: {
        type: sequelize_1.DataTypes.JSON,
    },
};
const dependencyStatusHelpModelOptions = {
    indexes: [{ unique: true, fields: ['category', 'title'] }],
};
const initializeDependencyStatusHelpModel = (sequelize) => {
    DependencyStatusHelpModelType.init(dependencyStatusHelpModelSchema, {
        sequelize,
        modelName: 'DependencyStatusHelp',
        ...dependencyStatusHelpModelOptions,
    });
    return DependencyStatusHelpModelType;
};
exports.default = initializeDependencyStatusHelpModel;
