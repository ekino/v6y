import { LinkType } from './LinkType.ts';
export interface NotificationType {
    _id?: number;
    title?: string;
    description?: string;
    links?: LinkType[];
}
export interface NotificationInputType {
    _id?: number;
    title: string;
    description: string;
    links?: string[];
}
