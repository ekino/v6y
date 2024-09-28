import { DependencyStatusHelpInputType } from '../types/DependencyStatusHelpType.ts';

export const dependencyStatus: { [key: string]: string } = {
    outdated: 'outdated',
    deprecated: 'deprecated',
    'up-to-date': 'up-to-date',
};

export const defaultDependencyStatusHelp: DependencyStatusHelpInputType[] = [
    {
        category: dependencyStatus.outdated,
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
    {
        category: dependencyStatus.deprecated,
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
    {
        category: dependencyStatus['up-to-date'],
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
];
