import { codeSmellCategories, codeSmellTypes } from './CodeSmellConfig.js';

export const auditStatus = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
};

export const defaultAuditHelpStatus = [
    {
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.performance}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.seo}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        title: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.accessibility}`,
        description: '',
        explanation: '',
    },
    {
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['first-contentful-paint']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['largest-contentful-paint']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['cumulative-layout-shift']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['circular-dependencies']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['instability-index']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['efferent-coupling']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['afferent-coupling']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Duplication']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['maintainability-index']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['maintainability-index-project-average']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['cyclomatic-complexity']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['halstead-program-length']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['halstead-program-volume']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['halstead-program-difficulty']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['halstead-program-effort']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['halstead-program-estimated-bugs']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['halstead-program-time-to-implement']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['physical-sloc']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['logical-sloc']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Compliance']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Security']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
];
