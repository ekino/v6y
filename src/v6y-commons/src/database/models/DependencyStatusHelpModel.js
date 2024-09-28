import { DataTypes, Model } from 'sequelize';
export class DependencyStatusHelpModelType extends Model {
    _id;
    category;
    title;
    description;
    links;
}
const dependencyStatusHelpModelSchema = {
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
    },
    links: {
        type: DataTypes.JSON,
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
export default initializeDependencyStatusHelpModel;
