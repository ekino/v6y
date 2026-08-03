import accounts from './accounts.ts';
import applications from './applications.ts';
import auditHelps from './auditHelps.ts';
import dependencyStatusHelps from './dependencyStatusHelps.ts';
import deprecatedDependencies from './deprecatedDependencies.ts';
import evolutionHelps from './evolutionHelps.ts';
import faqs from './faqs.ts';
import notifications from './notifications.ts';
import type { ResourceConfig } from './types.ts';

export const resources: ResourceConfig[] = [
    accounts,
    applications,
    notifications,
    faqs,
    evolutionHelps,
    auditHelps,
    dependencyStatusHelps,
    deprecatedDependencies,
];

export const getResourceConfig = (name: string): ResourceConfig | undefined =>
    resources.find((resource) => resource.name === name);

export * from './types.ts';
