"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeprecatedDependencyModelType = void 0;
const sequelize_1 = require("sequelize");
class DeprecatedDependencyModelType extends sequelize_1.Model {
    _id;
    name;
}
exports.DeprecatedDependencyModelType = DeprecatedDependencyModelType;
const deprecatedDependencyModelSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
};
const deprecatedDependencyModelOptions = {
    indexes: [{ unique: true, fields: ['name'] }],
};
const initializeDeprecatedDependencyModel = (sequelize) => {
    DeprecatedDependencyModelType.init(deprecatedDependencyModelSchema, {
        sequelize,
        modelName: 'DeprecatedDependency',
        ...deprecatedDependencyModelOptions,
    });
    return DeprecatedDependencyModelType;
};
exports.default = initializeDeprecatedDependencyModel;
