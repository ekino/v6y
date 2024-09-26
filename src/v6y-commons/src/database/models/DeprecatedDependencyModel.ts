import { DataTypes, Model, Sequelize } from 'sequelize';

import { DeprecatedDependencyType } from '../../types/DeprecatedDependencyType';

export class DeprecatedDependencyModelType
    extends Model<DeprecatedDependencyType>
    implements DeprecatedDependencyType
{
    public _id!: number;
    public name!: string;
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

const initializeDeprecatedDependencyModel = (sequelize: Sequelize) => {
    DeprecatedDependencyModelType.init(deprecatedDependencyModelSchema, {
        sequelize,
        modelName: 'DeprecatedDependency',
        ...deprecatedDependencyModelOptions,
    });
    return DeprecatedDependencyModelType;
};

export default initializeDeprecatedDependencyModel;
