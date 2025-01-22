import { DependencyVersionStatusHelpInputType } from '../types/DependencyVersionStatusHelpType.ts';

export const dependencyVersionStatus: { [key: string]: string } = {
    outdated: 'outdated',
    deprecated: 'deprecated',
    'up-to-date': 'up-to-date',
};

export const defaultDependencyVersionStatusHelp: DependencyVersionStatusHelpInputType[] = [
    {
        category: dependencyVersionStatus.outdated,
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
    {
        category: dependencyVersionStatus.deprecated,
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
    {
        category: dependencyVersionStatus['up-to-date'],
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
];
