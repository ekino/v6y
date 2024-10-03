import { DataTypes, Model, Sequelize } from 'sequelize';

import { DependencyStatusHelpType } from '../../types/DependencyStatusHelpType.ts';
import { LinkType } from '../../types/LinkType.ts';

export class DependencyStatusHelpModelType
    extends Model<DependencyStatusHelpType>
    implements DependencyStatusHelpType
{
    public _id!: number;
    public category!: string;
    public title!: string;
    public description?: string;
    public links?: LinkType[] | undefined;
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

const initializeDependencyStatusHelpModel = (sequelize: Sequelize) => {
    DependencyStatusHelpModelType.init(dependencyStatusHelpModelSchema, {
        sequelize,
        modelName: 'DependencyStatusHelp',
        ...dependencyStatusHelpModelOptions,
    });
    return DependencyStatusHelpModelType;
};

export default initializeDependencyStatusHelpModel;
