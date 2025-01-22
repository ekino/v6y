import { DataTypes, Model, Sequelize } from 'sequelize';

import { DependencyVersionStatusHelpType } from '../../types/DependencyVersionStatusHelpType.ts';
import { LinkType } from '../../types/LinkType.ts';

export class DependencyVersionStatusHelpModelType
    extends Model<DependencyVersionStatusHelpType>
    implements DependencyVersionStatusHelpType
{
    public _id!: number;
    public category!: string;
    public title!: string;
    public description?: string;
    public links?: LinkType[] | undefined;
}

const dependencyVersionStatusHelpModelSchema = {
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

const dependencyVersionStatusHelpModelOptions = {
    indexes: [{ unique: true, fields: ['category', 'title'] }],
};

const initializeDependencyVersionStatusHelpModel = (sequelize: Sequelize) => {
    DependencyVersionStatusHelpModelType.init(dependencyVersionStatusHelpModelSchema, {
        sequelize,
        modelName: 'DependencyVersionStatusHelp',
        ...dependencyVersionStatusHelpModelOptions,
    });
    return DependencyVersionStatusHelpModelType;
};

export default initializeDependencyVersionStatusHelpModel;
