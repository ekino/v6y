import { LinkType } from './LinkType';

export interface EvolutionHelpType {
    _id?: number;
    category?: string;
    title?: string;
    description?: string;
    explanation?: string;
    status?: string;
    links?: LinkType[];
}

export interface EvolutionHelpInputType {
    _id?: number;
    category: string;
    title: string;
    description: string;
    explanation?: string;
    status: string;
    links?: string[];
}
