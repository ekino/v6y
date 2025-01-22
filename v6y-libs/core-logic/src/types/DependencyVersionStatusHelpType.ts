import { LinkType } from './LinkType.ts';

export interface DependencyVersionStatusHelpType {
    _id?: number;
    category?: string;
    title?: string;
    description?: string;
    links?: LinkType[] | undefined;
}

export interface DependencyVersionStatusHelpInputType {
    _id?: number;
    category?: string | undefined;
    title?: string;
    description?: string;
    links?: string[] | undefined;
}
