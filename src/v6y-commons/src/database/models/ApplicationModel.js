import { DataTypes, Model } from 'sequelize';
export class ApplicationModelType extends Model {
    _id;
    name;
    acronym;
    contactMail;
    description;
    repo;
    links;
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
const initializeApplicationModel = (sequelize) => {
    ApplicationModelType.init(applicationSchema, {
        sequelize,
        modelName: 'Application',
        ...applicationOptions,
    });
    return ApplicationModelType;
};
export default initializeApplicationModel;
