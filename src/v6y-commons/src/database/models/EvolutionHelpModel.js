"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionHelpModelType = void 0;
const sequelize_1 = require("sequelize");
class EvolutionHelpModelType extends sequelize_1.Model {
    _id;
    category;
    title;
    description;
    status;
    links;
}
exports.EvolutionHelpModelType = EvolutionHelpModelType;
const evolutionHelpModelSchema = {
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
    status: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    links: {
        type: sequelize_1.DataTypes.JSON,
    },
};
const evolutionHelpModelOptions = {
    indexes: [{ unique: true, fields: ['category', 'title', 'status'] }],
};
const initializeEvolutionHelpModel = (sequelize) => {
    EvolutionHelpModelType.init(evolutionHelpModelSchema, {
        sequelize,
        modelName: 'EvolutionHelp',
        ...evolutionHelpModelOptions,
    });
    return EvolutionHelpModelType;
};
exports.default = initializeEvolutionHelpModel;
