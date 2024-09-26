"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDependencyStatusHelp = exports.dependencyStatus = void 0;
exports.dependencyStatus = {
    outdated: 'outdated',
    deprecated: 'deprecated',
    'up-to-date': 'up-to-date',
};
exports.defaultDependencyStatusHelp = [
    {
        category: exports.dependencyStatus.outdated,
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
    {
        category: exports.dependencyStatus.deprecated,
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
    {
        category: exports.dependencyStatus['up-to-date'],
        title: 'Default Title',
        description: 'Default Description',
        links: undefined,
    },
];
