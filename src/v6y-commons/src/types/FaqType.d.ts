import { LinkType } from './LinkType.ts';
export interface FaqType {
    _id?: number;
    title?: string;
    description?: string;
    links?: LinkType[];
}
export interface FaqInputType {
    _id?: number;
    title: string;
    description: string;
    links?: string[];
}
