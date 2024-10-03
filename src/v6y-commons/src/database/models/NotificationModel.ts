import { DataTypes, Model, Sequelize } from 'sequelize';

import { LinkType } from '../../types/LinkType.ts';
import { NotificationType } from '../../types/NotificationType.ts';

export class NotificationModelType extends Model<NotificationType> implements NotificationType {
    public _id!: number;
    public title!: string;
    public description!: string;
    public links?: LinkType[];
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

const initializeNotificationModel = (sequelize: Sequelize) => {
    NotificationModelType.init(notificationSchema, {
        sequelize,
        modelName: 'Notification',
        ...notificationOptions,
    });
    return NotificationModelType;
};

export default initializeNotificationModel;
