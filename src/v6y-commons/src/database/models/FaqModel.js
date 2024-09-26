"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqModelType = void 0;
const sequelize_1 = require("sequelize");
class FaqModelType extends sequelize_1.Model {
    _id;
    title;
    description;
    links;
}
exports.FaqModelType = FaqModelType;
const faqSchema = {
    _id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    links: {
        type: sequelize_1.DataTypes.JSON,
    },
};
const faqOptions = {
    indexes: [{ unique: true, fields: ['title'] }],
};
const initializeFaqModel = (sequelize) => {
    FaqModelType.init(faqSchema, {
        sequelize,
        modelName: 'Faq',
        ...faqOptions,
    });
    return FaqModelType;
};
exports.default = initializeFaqModel;
