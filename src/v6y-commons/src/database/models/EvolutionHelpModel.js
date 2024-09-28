import { DataTypes, Model } from 'sequelize';
export class EvolutionHelpModelType extends Model {
    _id;
    category;
    title;
    description;
    status;
    links;
}
const evolutionHelpModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    links: {
        type: DataTypes.JSON,
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
export default initializeEvolutionHelpModel;
