import { LinkType } from './LinkType.ts';

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

export interface EvolutionHelpStatusType {
    label: string;
    value: string;
}
