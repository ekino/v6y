import { DataTypes, Model, Sequelize } from 'sequelize';

import { DataDogConfigType } from '../../types/ApplicationConfigType.ts';
import { ApplicationType } from '../../types/ApplicationType.ts';
import { LinkType } from '../../types/LinkType.ts';
import { RepositoryType } from '../../types/RepositoryType.ts';

export class ApplicationModelType extends Model<ApplicationType> implements ApplicationType {
    declare _id: number;
    declare name: string;
    declare acronym: string;
    declare contactMail: string;
    declare description: string;
    declare repo?: RepositoryType;
    declare configuration?: {
        dataDog?: DataDogConfigType;
    };
    declare links?: LinkType[];
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
    configuration: {
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
