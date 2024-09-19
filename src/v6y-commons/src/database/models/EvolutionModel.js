import { DataTypes } from 'sequelize';

const evolutionModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    evolutionHelp: {
        type: DataTypes.JSON,
    },
    module: {
        type: DataTypes.JSON,
    },
};

const evolutionModelOptions = {};

const EvolutionModel = {
    name: 'Evolution',
    schema: evolutionModelSchema,
    options: evolutionModelOptions,
};

export default EvolutionModel;
