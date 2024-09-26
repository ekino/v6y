"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionModelType = void 0;
const sequelize_1 = require("sequelize");
class EvolutionModelType extends sequelize_1.Model {
    _id;
    appId;
    category;
    evolutionHelp;
    module;
}
exports.EvolutionModelType = EvolutionModelType;
const evolutionModelSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    evolutionHelp: {
        type: sequelize_1.DataTypes.JSON,
    },
    module: {
        type: sequelize_1.DataTypes.JSON,
    },
};
const evolutionModelOptions = {};
const initializeEvolutionModel = (sequelize) => {
    EvolutionModelType.init(evolutionModelSchema, {
        sequelize,
        modelName: 'Evolution',
        ...evolutionModelOptions,
    });
    return EvolutionModelType;
};
exports.default = initializeEvolutionModel;
