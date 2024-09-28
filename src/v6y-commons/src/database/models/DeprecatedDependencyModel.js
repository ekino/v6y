import { DataTypes, Model } from 'sequelize';
export class DeprecatedDependencyModelType extends Model {
    _id;
    name;
}
const deprecatedDependencyModelSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
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
export default initializeDeprecatedDependencyModel;
