import { DataTypes, Model } from 'sequelize';
export class EvolutionModelType extends Model {
    _id;
    appId;
    category;
    evolutionHelp;
    module;
}
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
const initializeEvolutionModel = (sequelize) => {
    EvolutionModelType.init(evolutionModelSchema, {
        sequelize,
        modelName: 'Evolution',
        ...evolutionModelOptions,
    });
    return EvolutionModelType;
};
export default initializeEvolutionModel;
