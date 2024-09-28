import { Model, Sequelize } from 'sequelize';
import { LinkType } from '../../types/LinkType.ts';
import { NotificationType } from '../../types/NotificationType.ts';
export declare class NotificationModelType extends Model<NotificationType> implements NotificationType {
    _id: number;
    title: string;
    description: string;
    links?: LinkType[];
}
declare const initializeNotificationModel: (sequelize: Sequelize) => typeof NotificationModelType;
export default initializeNotificationModel;
