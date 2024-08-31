/* eslint-disable max-lines */

// to read from Bistro
export const dependencyRecommendedVersions = {
    react: '17.0.2',
    'react-dom': '17.0.2',
    'react-hot-loader': '4.13.0',
    'react-router-dom': '5.3.0',
    '@babel/preset-typescript': '7.16.7',
    '@types/chai': '4.3.1',
    '@types/enzyme': '3.10.12',
    '@types/jest': '27.5.1',
    '@typescript-eslint/eslint-plugin': '5.12.1',
    '@typescript-eslint/parser': '5.12.1',
};

// static and private
const codeSmellTypes = {
    Dependency: 'Dependency',
    Lighthouse: 'Lighthouse',
    'Code-Coupling': 'Code-Coupling',
    'Code-Duplication': 'Code-Duplication',
    'Code-Complexity': 'Code-Complexity',
    'Code-Compliance': 'Code-Compliance',
    'Code-Security': 'Code-Security',
};

const codeSmellCategories = {
    deprecated: 'deprecated',
    outdated: 'outdated',
    performance: 'performance',
    seo: 'seo',
    accessibility: 'accessibility',
    'first-contentful-paint': 'first-contentful-paint',
    'largest-contentful-paint': 'largest-contentful-paint',
    'cumulative-layout-shift': 'cumulative-layout-shift',
    'circular-dependencies': 'circular-dependencies',
    'instability-index': 'instability-index',
    'efferent-coupling': 'efferent-coupling',
    'afferent-coupling': 'afferent-coupling',
    'maintainability-index': 'maintainability-index',
    'cyclomatic-complexity': 'cyclomatic-complexity',
};

export const evolutionHelpStatus = {
    critical: 'critical',
    important: 'important',
    recommended: 'recommended',
};

export const dependencyStatus = {
    outdated: 'outdated',
    deprecated: 'deprecated',
    'up-to-date': 'up-to-date',
};

export const auditStatus = {
    success: 'success',
    warning: 'warning',
    error: 'error',
};

export const keywordStatus = {
    success: 'success',
    warning: 'warning',
    error: 'error',
};

// static parts (BO) V1
export const auditHelps = [
    {
        title: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.performance}`,
        description: '',
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.seo}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.accessibility}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['first-contentful-paint']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['largest-contentful-paint']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['cumulative-layout-shift']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['circular-dependencies']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['instability-index']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['efferent-coupling']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['afferent-coupling']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Duplication']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['maintainability-index']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['cyclomatic-complexity']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Compliance']}`,
        explanation: null,
    },
    {
        title: '',
        description: '',
        category: `${codeSmellTypes['Code-Security']}`,
        explanation: null,
    },
];

export const evolutionHelps = [
    {
        _id: 'evolution-help-1',
        category: `${codeSmellTypes.Dependency}-${codeSmellCategories.deprecated}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-2',
        category: `${codeSmellTypes.Dependency}-${codeSmellCategories.outdated}`,
        status: evolutionHelpStatus.recommended,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-3',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.performance}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-4',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.seo}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-5',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories.accessibility}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-6',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['first-contentful-paint']}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-7',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['largest-contentful-paint']}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-8',
        category: `${codeSmellTypes.Lighthouse}-${codeSmellCategories['cumulative-layout-shift']}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-9',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['circular-dependencies']}`,
        status: evolutionHelpStatus.critical,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-10',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['instability-index']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-11',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['efferent-coupling']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-12',
        category: `${codeSmellTypes['Code-Coupling']}-${codeSmellCategories['afferent-coupling']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-13',
        category: `${codeSmellTypes['Code-Duplication']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-14',
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['maintainability-index']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-15',
        category: `${codeSmellTypes['Code-Complexity']}-${codeSmellCategories['cyclomatic-complexity']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-16',
        category: `${codeSmellTypes['Code-Compliance']}`,
        status: evolutionHelpStatus.important,
        title: '',
        description: '',
        links: [],
    },
    {
        _id: 'evolution-help-17',
        category: `${codeSmellTypes['Code-Security']}`,
        status: evolutionHelpStatus.recommended,
        title: '',
        description: '',
        links: [],
    },
];

export const dependencyStatusHelp = [
    {
        _id: 'A123',
        title: '',
        description: '',
        category: dependencyStatus.outdated,
        links: [],
    },
    {
        _id: 'A124',
        title: '',
        description: '',
        category: dependencyStatus.deprecated,
        links: [],
    },
    {
        _id: 'A125',
        title: '',
        description: '',
        category: dependencyStatus['up-to-date'],
        links: [],
    },
];

export const deprecatedDependencies = [
    { _id: 'A111', name: '@babel/polyfill/noConflict' },
    { _id: 'A112', name: '@babel/polyfill' },
    { _id: 'A113', name: '@babel/compat-data' },
    { _id: 'A114', name: '@babel/plugin-proposal-numeric-separator' },
    { _id: 'A115', name: '@babel/plugin-syntax-dynamic-import' },
    { _id: 'A116', name: '@babel/plugin-transform-modules-commonjs' },
    { _id: 'A117', name: '@babel/polyfill' },
    { _id: 'A118', name: 'babel-plugin-dynamic-import-node' },
    { _id: 'A119', name: '@babel/plugin-proposal-export-default-from' },
    { _id: 'A1110', name: '@babel/plugin-syntax-class-properties' },
    { _id: 'A1111', name: '@babel/plugin-transform-react-jsx' },
    { _id: 'A1112', name: '@babel/plugin-proposal-optional-chaining' },
    { _id: 'A1113', name: '@babel/plugin-proposal-class-properties' },
    { _id: 'A1114', name: '@babel/plugin-proposal-object-rest-spread' },
    { _id: 'A1115', name: '@babel/plugin-proposal-nullish-coalescing-operator' },
    { _id: 'A1116', name: 'node-sass' },
    { _id: 'A1117', name: 'lodash' },
    { _id: 'A1118', name: 'moment' },
    { _id: 'A1119', name: '@types/lodash' },
    { _id: 'A1120', name: 'babel-plugin-lodash' },
    { _id: 'A1121', name: 'smoothscroll-polyfill' },
    { _id: 'A1122', name: 'whatwg-fetch' },
    { _id: 'A1123', name: 'libphonenumber-js' },
    { _id: 'A1124', name: 'es6-promise-promise' },
    { _id: 'A1125', name: 'url-search-params-polyfill' },
];

export const faqs = [
    {
        _id: 'A123',
        title: 'Unlocking Codebase Performance with Vitality',
        color: '13',
        description:
            'Discover how Vitality identifies bottlenecks, optimizes resource usage, and enhances the overall health of your applications.',
        links: [
            {
                label: 'Performance Optimization Guide',
                value: 'https://docs.vitality.app/performance',
                description: '',
            },
        ],
    },
    {
        _id: 'B123',
        title: 'Your Path to Smoother, Faster Applications',
        color: '13',
        description:
            'Learn how Vitality empowers developers to build and maintain high-quality applications that deliver exceptional user experiences.',
        links: [
            {
                label: 'Get Started with Vitality',
                value: 'https://docs.vitality.app/getting-started',
                description: '',
            },
        ],
    },
    {
        _id: 'C123',
        title: 'Proactive Codebase Monitoring and Analysis',
        color: '13',
        description:
            "Explore Vitality's comprehensive suite of tools for real-time monitoring, automated analysis, and actionable insights into your codebase.",
        links: [
            {
                label: 'Feature Overview',
                value: 'https://docs.vitality.app/features',
                description: '',
            },
        ],
    },
    {
        _id: 'D123',
        title: 'Why Vitality?',
        color: '13',
        description:
            'Understand the benefits of using Vitality to ensure your applications are robust, efficient, and scalable.',
        links: [
            {
                label: 'Why Vitality?',
                value: 'https://docs.vitality.app/why-vitality',
                description: '',
            },
        ],
    },
    {
        _id: 'E123',
        title: 'Integrating Vitality into Your Workflow',
        color: '13',
        description:
            'See how easily Vitality integrates into your existing development pipeline, providing continuous feedback and improvement opportunities.',
        links: [
            {
                label: 'Integration Guide',
                value: 'https://docs.vitality.app/integration',
                description: '',
            },
        ],
    },
    {
        _id: 'F123',
        title: 'Success Stories with Vitality',
        color: '13',
        description:
            "Read real-world case studies of how teams have used Vitality to achieve significant improvements in their applications' performance and maintainability.",
        links: [
            {
                label: 'Case Studies',
                value: 'https://docs.vitality.app/case-studies',
                description: '',
            },
        ],
    },
];

export const notifications = [
    {
        _id: 'A128',
        title: 'Vitality Update Available!',
        color: '14',
        description:
            'Vitality v2.5 is now ready for download.  New features include enhanced performance monitoring and improved code analysis.',
        links: [
            {
                label: 'Update Now',
                value: 'https://downloads.vitality.app/v2.5',
                description: '',
            },
            {
                label: 'Release Notes',
                value: 'https://docs.vitality.app/release-notes/v2.5',
                description: '',
            },
        ],
    },
    {
        _id: 'B128',
        title: 'Potential Performance Issue Detected',
        color: '14',
        description:
            'Vitality has identified a potential performance issue in your XYZ service. Please review the detailed report for recommendations.',
        links: [
            {
                label: 'View Report',
                value: 'https://app.vitality.app/reports/xyz-service-performance-issue',
                description: '',
            },
        ],
    },
    {
        _id: 'C128',
        title: 'Security Vulnerability Patched',
        color: '14',
        description:
            "A critical security vulnerability in Vitality's dependency library has been addressed. Please update to the latest version.",
        links: [
            {
                label: 'Update Instructions',
                value: 'https://docs.vitality.app/update-instructions',
                description: '',
            },
        ],
    },
    {
        _id: 'D128',
        title: 'New Tutorial: Optimizing Frontend Code',
        color: '14',
        description:
            "Our latest tutorial shows you how to leverage Vitality's insights to improve your frontend code's performance and maintainability.",
        links: [
            {
                label: 'Read the Tutorial',
                value: 'https://docs.vitality.app/tutorials/frontend-optimization',
                description: '',
            },
        ],
    },
];

// full dynamic parts (BO) V1
export const auditsReports = [
    {
        // static parts: help key: type-category (to find dynamically)
        //...(auditHelps['Lighthouse-performance'] || {}),

        // dynamic parts
        _id: 'A12',
        type: codeSmellTypes.Lighthouse,
        category: codeSmellCategories.performance,
        subCategory: null,
        status: auditStatus.success,
        score: 92,
        scorePercent: 92,
        scoreUnit: '%',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://www.examplewebsite.com',
        },
    },
    {
        // ...(auditHelps['Lighthouse-seo'] || {}),

        // dynamic parts
        _id: 'A13',
        type: codeSmellTypes.Lighthouse,
        category: codeSmellCategories.seo,
        subCategory: null,
        status: auditStatus.success,
        score: 92,
        scorePercent: 92,
        scoreUnit: '%',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://www.examplewebsite.com',
        },
    },
    {
        //...(auditHelps['Lighthouse-accessibility'] || {}),

        // dynamic parts
        _id: 'A14',
        type: codeSmellTypes.Lighthouse,
        category: codeSmellCategories.accessibility,
        subCategory: null,
        status: auditStatus.warning,
        score: 75,
        scorePercent: 75,
        scoreUnit: '%',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://www.examplewebsite.com',
        },
    },
    {
        // ...(auditHelps['Lighthouse-first-contentful-paint'] || {}),

        // dynamic parts
        _id: 'A14',
        type: codeSmellTypes.Lighthouse,
        category: codeSmellCategories['first-contentful-paint'],
        subCategory: null,
        status: auditStatus.error,
        score: 1.2,
        scorePercent: 24,
        scoreUnit: 's',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://www.examplewebsite.com',
        },
    },
    {
        //...(auditHelps['Lighthouse-largest-contentful-paint'] || {}),

        // dynamic parts
        _id: 'A15',
        type: codeSmellTypes.Lighthouse,
        category: codeSmellCategories['last-contentful-paint'],
        subCategory: null,
        status: auditStatus.warning,
        score: 2.8,
        scorePercent: 56,
        scoreUnit: 's',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://www.examplewebsite.com',
        },
    },
    {
        // ...(auditHelps['Lighthouse-cumulative-layout-shift'] || {}),

        // dynamic parts
        _id: 'A16',
        type: codeSmellTypes.Lighthouse,
        category: codeSmellCategories['cumulative-layout-shift'],
        subCategory: null,
        status: auditStatus.success,
        score: 0.05,
        scorePercent: 5,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://www.examplewebsite.com',
        },
    },
    {
        // ...(auditHelps['Code-Security'] || {}),

        // dynamic parts
        _id: 'A17',
        type: codeSmellTypes['Code-Security'],
        category: 'xss-vulnerability',
        subCategory: null,
        status: auditStatus.error,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/vulnerable.js#L12',
        },
    },
    {
        //...(auditHelps['Code-Compliance'] || {}),

        // dynamic parts
        _id: 'A18',
        type: codeSmellTypes['Code-Compliance'],
        category: 'unused-variable',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/code.js#L5',
        },
    },
    {
        //...(auditHelps['Code-Complexity-cyclomatic-complexity'] || {}),

        // dynamic parts
        _id: 'A19',
        type: codeSmellTypes['Code-Complexity'],
        category: 'cyclomatic-complexity',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/code.js#L25',
        },
    },
    {
        // ...(auditHelps['Code-Complexity-maintainability-index'] || {}),

        // dynamic parts
        _id: 'A20',
        type: codeSmellTypes['Code-Complexity'],
        category: 'maintainability-index',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/code.js#L25',
        },
    },
    {
        //...(auditHelps['Code-Duplication'] || {}),

        // dynamic parts
        _id: 'A21',
        type: codeSmellTypes['Code-Duplication'],
        category: 'repeated-code-block',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/code.js#L50,L75',
        },
    },
    {
        //...(auditHelps['Code-Coupling-afferent-coupling'] || {}),

        // dynamic parts
        _id: 'A22',
        type: codeSmellTypes['Code-Coupling'],
        category: 'afferent-coupling',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/user.js',
        },
    },
    {
        //...(auditHelps['Code-Coupling-efferent-coupling'] || {}),

        // dynamic parts
        _id: 'A23',
        type: codeSmellTypes['Code-Coupling'],
        category: 'efferent-coupling',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/user.js',
        },
    },
    {
        //...(auditHelps['Code-Coupling-instability-index'] || {}),

        // dynamic parts
        _id: 'A24',
        type: codeSmellTypes['Code-Coupling'],
        category: 'instability-index',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/user.js',
        },
    },
    {
        //...(auditHelps['Code-Coupling-circular-dependencies'] || {}),

        // dynamic parts
        _id: 'A25',
        type: codeSmellTypes['Code-Coupling'],
        category: 'circular-dependencies',
        subCategory: null,
        status: auditStatus.warning,
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
            url: 'https://github.com/project/repo/blob/main/user.js',
        },
    },
];

export const evolutions = [
    {
        // static parts: help key: type-category
        // ...(evolutionHelps['Dependency-deprecated'] || {}),

        // dynamic parts
        _id: 'A8901WXZSX1c1c1c1c1c1c1c1c1c',
        type: codeSmellTypes.Dependency,
        category: codeSmellCategories.deprecated,
        subCategory: null,
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
        },
    },
    {
        // static parts: help key: type-category
        // ...(evolutionHelps['Dependency-outdated'] || {}),

        // dynamic parts
        _id: 'A8901WXZSX1c1c1c1c1c1c1c1c1c',
        type: codeSmellTypes.Dependency,
        category: codeSmellCategories.outdated,
        subCategory: null,
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
        },
    },
];

export const keywords = [
    {
        _id: '1a1a1a1a1a1a1a1a1a1a1a1a',
        label: 'Angular',
        version: '12.0.0',
        status: keywordStatus.error,
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
        },
    },
    {
        _id: '2a2a2a2a2a2a2a2a2a2a2a2a',
        label: 'NGRX',
        version: '11.1.0',
        status: keywordStatus.warning,
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
        },
    },
    {
        _id: '3a3a3a3a3a3a3a3a3a3a3a3a',
        label: 'RxJS',
        version: '6.6.7',
        status: keywordStatus.success,
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
        },
    },
    {
        _id: '4a4a4a4a4a4a4a4a4a4a4a4a',
        label: 'Vue',
        version: '3.2.26',
        status: keywordStatus.warning,
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'front-js',
        },
    },
];

export const keywordsStats = [
    {
        keyword: {
            _id: '1a1a1a1a1a1a1a1a1a1a1a1a',
            label: 'Angular',
            version: '12.0.0',
            status: keywordStatus.error,
            module: {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                path: 'front-js',
            },
        },
        total: 3,
    },
    {
        keyword: {
            _id: '2a2a2a2a2a2a2a2a2a2a2a2a',
            label: 'NGRX',
            version: '11.1.0',
            status: keywordStatus.warning,
            module: {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                path: 'front-js',
            },
        },
        total: 5,
    },
];

export const dependencies = [
    {
        _id: '1c1c1c1c1c1c1c1c1c1c1c1c1c',
        type: 'frontend',
        name: '@types/react',
        version: '17.0.39',
        module: {
            appId: '20b20b20b20b20b20b',
            branch: 'main',
            path: 'modules/front-js',
            url: 'https://github.fr.world.socgen/AppliDigitalClient/bddf_awt_acf_acs/tree/master/modules/front-js',
        },
    },
    {
        _id: '3c3c3c3c3c3c3c3c3c3c3c3c3c',
        type: 'frontend',
        name: 'd3',
        version: '6.7.0',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'feature/customer-analytics',
            path: 'modules/front-js',
            url: 'https://github.com/CRMTech/crm-system',
        },
    },
    {
        _id: '4c4c4c4c4c4c4c4c4c4c4c4c4c',
        type: 'frontend',
        name: 'axios',
        version: '0.21.1',
        module: {
            appId: '20b20b20b20b20b20b20b20b',
            branch: 'main',
            path: 'modules/front-js',
            url: 'https://github.com/CRMTech/crm-system',
        },
    },
];

export const appList = [
    {
        _id: '20b20b20b20b20b20b20b20b',
        name: 'Advanced CRM System',
        acronym: 'ACRMS',
        contactMail: 'michael.scott@crmtech.com',
        description:
            'A next-generation CRM system designed for small to large enterprises, featuring a React frontend and a Spring Boot backend.',
        repo: {
            webUrl: 'https://github.com/CRMTech/crm-system', // static
            gitUrl: 'git@github.com:CRMTech/crm-system.git', // static

            // dynamic
            name: 'crm-system',
            fullName: 'CRMTech/crm-system',
            owner: 'CRMTech',
            allBranches: [
                'main',
                'develop',
                'feature/customer-analytics',
                'feature/email-integration',
            ],
        },
        links: [
            {
                label: 'Application production url',
                value: 'https://help.crmtech.app',
                description: 'Get assistance with your CRM system.',
            },
            {
                label: 'Application code quality platform url',
                value: 'https://help.crmtech.app',
                description: '',
            },
            {
                label: 'Application CI/CD platform url',
                value: 'https://ci.crmtech.app',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                label: 'Application deployment platform url',
                value: 'https://dashboard.crmtech.app',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
    },
];
