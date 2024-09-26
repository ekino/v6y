"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModelType = void 0;
const sequelize_1 = require("sequelize");
class NotificationModelType extends sequelize_1.Model {
    _id;
    title;
    description;
    links;
}
exports.NotificationModelType = NotificationModelType;
const notificationSchema = {
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
const notificationOptions = {
    indexes: [{ unique: true, fields: ['title'] }],
};
const initializeNotificationModel = (sequelize) => {
    NotificationModelType.init(notificationSchema, {
        sequelize,
        modelName: 'Notification',
        ...notificationOptions,
    });
    return NotificationModelType;
};
exports.default = initializeNotificationModel;
