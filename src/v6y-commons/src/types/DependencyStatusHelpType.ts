import { LinkType } from './LinkType';

export interface DependencyStatusHelpType {
    _id?: number;
    category?: string;
    title?: string;
    description?: string;
    links?: LinkType[] | undefined;
}

export interface DependencyStatusHelpInputType {
    _id?: number;
    category?: string | undefined;
    title?: string;
    description?: string;
    links?: string[] | undefined;
}
