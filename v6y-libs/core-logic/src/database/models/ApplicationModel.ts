import { DataTypes, Model, Sequelize } from 'sequelize';

import { ApplicationType } from '../../types/ApplicationType.ts';
import { LinkType } from '../../types/LinkType.ts';
import { RepositoryType } from '../../types/RepositoryType.ts';

export class ApplicationModelType extends Model<ApplicationType> implements ApplicationType {
    public _id!: number;
    public name!: string;
    public acronym!: string;
    public contactMail!: string;
    public description!: string;
    public repo?: RepositoryType;
    public links?: LinkType[];
}

const applicationSchema = {
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
    acronym: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    contactMail: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    repo: {
        type: DataTypes.JSON,
    },
    links: {
        type: DataTypes.JSON,
    },
};

const applicationOptions = {
    indexes: [{ unique: true, fields: ['name', 'acronym'] }],
};

const initializeApplicationModel = (sequelize: Sequelize) => {
    ApplicationModelType.init(applicationSchema, {
        sequelize,
        modelName: 'Application',
        ...applicationOptions,
    });

    return ApplicationModelType;
};

export default initializeApplicationModel;
