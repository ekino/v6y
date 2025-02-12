import { AuditHelpType } from '../types/AuditHelpType.ts';
import { codeSmellCategories, codeSmellTypes } from './CodeSmellConfig.ts';
import { devOpsCategories, devOpsType } from './DevOpsConfig.ts';
import { securityAntiPatterns } from './SecuritySmellConfig.ts';

export const auditStatus: Record<string, string> = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
};

export const defaultAuditHelpStatus: AuditHelpType[] = [
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
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.performance}`,
        title: 'Default Title',
        description: 'Default Description',
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
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['total-blocking-time']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['speed-index']}`,
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
        category: `${codeSmellTypes['Code-Duplication']}-${codeSmellCategories['code-duplication-percent']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Duplication']}-${codeSmellCategories['code-duplication-total-duplicated-lines']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Duplication']}-${codeSmellCategories['code-duplication-file']}`,
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
        category: `${codeSmellTypes['Code-Modularity']}-${codeSmellCategories['interaction-density']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Modularity']}-${codeSmellCategories['interaction-groups']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Modularity']}-${codeSmellCategories['independent-files-ratio']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Modularity']}-${codeSmellCategories['file-degree-centrality']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Modularity']}-${codeSmellCategories['file-in-degree-centrality']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${codeSmellTypes['Code-Modularity']}-${codeSmellCategories['file-out-degree-centrality']}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    ...securityAntiPatterns.map(({ category }) => ({
        category: `${codeSmellTypes['Code-Security']}-${category}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    })),
    // DORA Metrics
    {
        category: `${devOpsType.DORA}-${devOpsCategories.LEAD_TIME_FOR_CHANGES}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${devOpsType.DORA}-${devOpsCategories.LEAD_REVIEW_TIME}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${devOpsType.DORA}-${devOpsCategories.DEPLOYMENT_FREQUENCY}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${devOpsType.DORA}-${devOpsCategories.CHANGE_FAILURE_RATE}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
    {
        category: `${devOpsType.DORA}-${devOpsCategories.MEAN_TIME_TO_RESTORE_SERVICE}`,
        title: 'Default Title',
        description: 'Default Description',
        explanation: '',
    },
];
