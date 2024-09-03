import { DataTypes } from 'sequelize';

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
    repo: DataTypes.JSON,
    links: DataTypes.JSON,
};

const applicationOptions = {
    indexes: [{ unique: true, fields: ['name', 'acronym'] }],
};

const ApplicationModel = {
    name: 'Application',
    schema: applicationSchema,
    options: applicationOptions,
};

export default ApplicationModel;
