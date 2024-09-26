"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModelType = void 0;
const sequelize_1 = require("sequelize");
class ApplicationModelType extends sequelize_1.Model {
    _id;
    name;
    acronym;
    contactMail;
    description;
    repo;
    links;
}
exports.ApplicationModelType = ApplicationModelType;
const applicationSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    acronym: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    contactMail: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    repo: {
        type: sequelize_1.DataTypes.JSON,
    },
    links: {
        type: sequelize_1.DataTypes.JSON,
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
exports.default = initializeApplicationModel;
