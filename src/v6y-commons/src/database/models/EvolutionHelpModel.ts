import { DataTypes, Model, Sequelize } from 'sequelize';

import { EvolutionHelpType } from '../../types/EvolutionHelpType';
import { LinkType } from '../../types/LinkType';

export class EvolutionHelpModelType extends Model<EvolutionHelpType> implements EvolutionHelpType {
    public _id!: number;
    public category!: string;
    public title!: string;
    public description!: string;
    public status!: string;
    public links?: LinkType[];
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

const initializeEvolutionHelpModel = (sequelize: Sequelize) => {
    EvolutionHelpModelType.init(evolutionHelpModelSchema, {
        sequelize,
        modelName: 'EvolutionHelp',
        ...evolutionHelpModelOptions,
    });
    return EvolutionHelpModelType;
};

export default initializeEvolutionHelpModel;
