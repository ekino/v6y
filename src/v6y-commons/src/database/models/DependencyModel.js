import { DataTypes, Model } from 'sequelize';
export class DependencyModelType extends Model {
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
const dependencyModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appId: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.TEXT,
    },
    name: {
        type: DataTypes.TEXT,
    },
    version: {
        type: DataTypes.TEXT,
    },
    recommendedVersion: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.TEXT,
    },
    statusHelp: {
        type: DataTypes.JSON,
    },
    module: {
        type: DataTypes.JSON,
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
export default initializeDependencyModel;
