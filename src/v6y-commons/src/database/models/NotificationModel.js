import { DataTypes, Model } from 'sequelize';
export class NotificationModelType extends Model {
    _id;
    title;
    description;
    links;
}
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
const initializeNotificationModel = (sequelize) => {
    NotificationModelType.init(notificationSchema, {
        sequelize,
        modelName: 'Notification',
        ...notificationOptions,
    });
    return NotificationModelType;
};
export default initializeNotificationModel;
