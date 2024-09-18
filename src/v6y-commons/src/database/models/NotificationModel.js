import { DataTypes } from 'sequelize';

const notificationSchema = {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    links: {
        type: DataTypes.JSON,
    },
};

const notificationOptions = {
    indexes: [{ unique: true, fields: ['title'] }],
};

const NotificationModel = {
    name: 'Notification',
    schema: notificationSchema,
    options: notificationOptions,
};

export default NotificationModel;
