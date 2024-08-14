import VitalityTheme from './VitalityTheme.js';

const VITALITY_DASHBOARD_DATASOURCE = [
    {
        autoFocus: true,
        defaultChecked: false,
        title: 'React',
        description: 'Choose this option to view React applications.',
        url: 'app-list?keywords=react',
        imageUrl: 'react_logo.svg',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular',
        description: 'Choose this option to view Angular applications.',
        url: 'app-list?keywords=angular',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'React Legacy',
        description: 'Choose this option to view React Legacy applications.',
        url: 'app-list?keywords=legacy-react',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular Legacy',
        description: 'Choose this option to view Angular Legacy applications.',
        url: 'app-list?keywords=legacy-angular',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Stack usage stats',
        description: 'Choose this option to view Stack usage stats.',
        url: 'stack-stats',
        imageUrl: '',
    },
];

const VITALITY_APPS_DEPENDENCIES_STATUS = [
    {
        key: 'all',
        label: 'All',
        helpMessage: 'Show all dependencies',
    },
    {
        key: 'up-to-date',
        label: 'Valid',
        helpMessage:
            'Show only valid dependencies (a valid dependency is a recommended dependency with an up-to-date version)',
    },
    {
        key: 'outdated',
        label: 'Outdated',
        helpMessage:
            'Show only outdated dependencies (an outdated dependency is a recommended dependency but with a non-up-to-date version)',
    },
    {
        key: 'deprecated',
        label: 'Forbidden',
        helpMessage:
            'Show only forbidden dependencies (a forbidden dependency is a dependency that should not be added to the project)',
    },
];

const AUDIT_REPORT_TYPES = {
    codeCompliance: 'Code Compliance',
    codeComplexity: 'Code Complexity',
    codeCoupling: 'Code Coupling',
    lighthouse: 'Lighthouse',
    codeSecurity: 'Code Security',
    codeDuplication: 'Code Duplication',
};

const AUDIT_STATUS_COLORS = {
    success: VitalityTheme.token.colorSuccess,
    warning: VitalityTheme.token.colorWarning,
    error: VitalityTheme.token.colorError,
};

const normalizeDependencyVersion = (version) => version?.replace('=', '');

const VitalityCommonConfig = {
    VITALITY_DASHBOARD_DATASOURCE,
    VITALITY_APPS_DEPENDENCIES_STATUS,
    AUDIT_REPORT_TYPES,
    AUDIT_STATUS_COLORS,
    normalizeDependencyVersion,
};

export default VitalityCommonConfig;
