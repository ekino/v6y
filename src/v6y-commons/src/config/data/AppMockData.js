/* eslint-disable max-lines */

// static parts (BO)
const STACK_MIN_VALID_VERSIONS = {
    react: '17.0.2',
    'react-dom': '17.0.2',
    'react-hot-loader': '4.13.0',
    'react-router-dom': '5.3.0',
};

const STACK_MIN_VALID_DEV_VERSIONS = {
    'ts-jest': '28.0.2',
    typescript: '4.5.5',
    '@babel/preset-typescript': '7.16.7',
    '@types/chai': '4.3.1',
    '@types/enzyme': '3.10.12',
    '@types/jest': '27.5.1',
    '@typescript-eslint/eslint-plugin': '5.12.1',
    '@typescript-eslint/parser': '5.12.1',
    webpack: '5.69.0',
    'webpack-bundle-analyzer': '4.5.0',
    'webpack-dev-server': '4.7.4',
    'css-loader': '6.6.0',
    'sass-loader': '12.6.0',
    '@babel/eslint-parser': '7.17.0',
    '@babel/eslint-plugin': '7.16.5',
    eslint: '8.9.0',
    'eslint-config-airbnb': '19.0.4',
    'eslint-plugin-import': '2.25.4',
    'eslint-plugin-jsx-a11y': '6.5.1',
    'eslint-plugin-react': '7.29.2',
    'eslint-plugin-react-hooks': '4.3.0',
    'eslint-config-airbnb-typescript': '16.1.0',
    'eslint-import-resolver-typescript': '2.5.0',
    'babel-jest': '28.1.0',
    chai: '4.3.6',
    enzyme: '3.11.0',
    'enzyme-adapter-react-16': '1.15.6',
    'enzyme-to-json': '3.6.2',
    jest: '28.1.0',
    'jest-sonar-reporter': '2.0.0',
    'jest-stare': '2.3.0',
    'jest-environment-jsdom': '28.1.0',
};

export const frontendDepsMinVersions = {
    ...STACK_MIN_VALID_VERSIONS,
    ...STACK_MIN_VALID_DEV_VERSIONS,
};

export const frontendDeprecatedDeps = [
    '@babel/polyfill/noConflict',
    '@babel/polyfill',
    '@babel/compat-data',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/polyfill',
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-class-properties',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'node-sass',
    'lodash',
    'moment',
    '@types/lodash',
    'babel-plugin-lodash',
    'smoothscroll-polyfill',
    'whatwg-fetch',
    'libphonenumber-js',
    'es6-promise-promise',
    'url-search-params-polyfill',
];

export const DEPENDENCIES_STATUS = {
    // Dependency status (deprecated, outdated or up-to-date)
    outdated: 'outdated',
    deprecated: 'deprecated',
    'up-to-date': 'up-to-date',
};

export const dependenciesStatusHelp = {
    [DEPENDENCIES_STATUS.outdated]: {
        title: 'Outdated Module',
        status: 'outdated',
        description:
            'The XXX version used is outdated. Upgrade to version YYY for enhanced security and performance.',
        links: [
            {
                label: 'More Information',
                value: 'https://www.npmjs.com/package',
                description: '',
            },
        ],
    },
    [DEPENDENCIES_STATUS.deprecated]: {
        title: 'Deprecated Module',
        status: 'deprecated',
        description:
            'Module XXX is deprecated and should not be used. You should delete it or replace it with equivalent more recent and performant.',
        links: [
            {
                label: 'More Information',
                value: 'https://www.npmjs.com/package',
                description: '',
            },
        ],
    },
    [DEPENDENCIES_STATUS['up-to-date']]: {
        title: 'Up to date',
        status: 'up-to-date',
        description: 'Module XXX is up to date, no action is required',
        links: [],
    },
};

export const evolutions = [
    {
        _id: 'A8901WXZSX1c1c1c1c1c1c1c1c1c',
        title: 'Customer Analytics Dashboard',
        status: 'critical',
        description:
            'A new customer analytics dashboard has been implemented, providing insights into customer behavior and trends.',
        links: [
            {
                label: 'More Information',
                value: 'https://github.com/CRMTech/crm-system',
                description: '',
            },
            {
                label: 'Repository',
                value: 'https://github.com/CRMTech/crm-system',
                description: 'Access the source code repository on GitHub.',
            },
        ],
    },
    {
        _id: 'B8904WXZSX1c1c1c1c1c1c1c1c1c',
        title: 'Material-UI Update',
        status: 'important',
        description:
            'Material-UI library has been updated to the latest stable version to enhance UI consistency and performance.',
        links: [
            {
                label: 'More Information',
                value: 'https://github.com/CRMTech/crm-system',
                description: '',
            },
        ],
    },
    {
        _id: 'C8901WXZSX1c1c1c1c1c2d1d1d',
        title: 'Task Tracking Feature',
        status: 'recommended',
        description:
            'A new task tracking feature has been added, allowing users to manage tasks more effectively.',
        links: [
            {
                label: 'More Information',
                value: 'https://docs.pmtool.com',
                description: '',
            },
        ],
    },
];

// dynamic / semi dynamic parts

export const appList = [
    {
        _id: '20b20b20b20b20b20b20b20b',
        name: 'Advanced CRM System',
        mails: ['michael.scott@crmtech.com', 'michaelscott@gmail.com'],
        acronym: 'ACRMS',
        description:
            'A next-generation CRM system designed for small to large enterprises, featuring a React frontend and a Spring Boot backend.',
        repo: {
            name: 'crm-system',
            fullName: 'CRMTech/crm-system',
            owner: 'CRMTech',
            webUrl: 'https://github.com/CRMTech/crm-system',
            gitUrl: 'git@github.com:CRMTech/crm-system.git',
            allBranches: [
                'main',
                'develop',
                'feature/customer-analytics',
                'feature/email-integration',
            ],
        },
        links: [
            {
                label: 'Support Center',
                value: 'https://help.crmtech.app',
                description: 'Get assistance with your CRM system.',
            },
            {
                label: 'Developer Documentation',
                value: 'https://help.crmtech.app',
                description: '',
            },
            {
                label: 'Repository',
                value: 'https://github.com/CRMTech/crm-system',
                description: 'Access the source code repository on GitHub.',
            },
            {
                label: 'CI/CD Pipeline',
                value: 'https://ci.crmtech.app',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                label: 'Project Dashboard',
                value: 'https://dashboard.crmtech.app',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
    },
];

export const dependencies = [
    {
        _id: '1c1c1c1c1c1c1c1c1c1c1c1c1c',
        appId: '20b20b20b20b20b20b20b20b',
        type: 'frontend',
        branch: 'main',
        name: '@types/react',
        usedOnPath: 'modules/front-js',
        usedOnUrl:
            'https://github.fr.world.socgen/AppliDigitalClient/bddf_awt_acf_acs/tree/master/modules/front-js',
        version: '17.0.39',
    },
    {
        _id: '3c3c3c3c3c3c3c3c3c3c3c3c3c',
        appId: '20b20b20b20b20b20b20b20b',
        type: 'frontend',
        branch: 'feature/customer-analytics',
        name: 'd3',
        usedOnPath: 'modules/front-js',
        usedOnUrl: 'https://github.com/CRMTech/crm-system',
        version: '6.7.0',
    },
    {
        _id: '4c4c4c4c4c4c4c4c4c4c4c4c4c',
        appId: '20b20b20b20b20b20b20b20b',
        type: 'frontend',
        branch: 'main',
        name: 'axios',
        usedOnPath: 'modules/front-js',
        usedOnUrl: 'https://github.com/CRMTech/crm-system',
        version: '0.21.1',
    },
];

export const auditsReports = [
    {
        _id: 'A12',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Lighthouse',
        category: 'performance',
        title: 'Performance',
        description: 'Measures how quickly the content on your page loads and becomes interactive.',
        explanation: null,
        webUrl: 'https://www.examplewebsite.com',
        status: 'success',
        score: 92,
        scorePercent: 92,
        scoreUnit: '%',
        branch: null,
        module: null,
    },
    {
        _id: 'A13',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Lighthouse',
        category: 'seo',
        title: 'SEO',
        description: 'Evaluates how well your page is optimized for search engines.',
        explanation: null,
        webUrl: 'https://www.examplewebsite.com',
        status: 'success',
        score: 92,
        scorePercent: 92,
        scoreUnit: '%',
        branch: null,
        module: null,
    },
    {
        _id: 'A14',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Lighthouse',
        category: 'accessibility',
        title: 'Accessibility',
        description:
            'Checks for issues that might make it difficult for people with disabilities to use your website.',
        explanation:
            'There are opportunities to improve the accessibility of your web app. Manual testing is also encouraged as automatic detection may not catch all issues.',
        webUrl: 'https://www.examplewebsite.com',
        status: 'warning',
        score: 75,
        scorePercent: 75,
        scoreUnit: '%',
        branch: null,
        module: null,
    },
    {
        _id: 'A14',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Lighthouse',
        category: 'first-contentful-paint',
        title: 'First Contentful Paint',
        description:
            'Measures how long it takes for the first piece of content (text or image) to appear on the screen.',
        explanation:
            'First Contentful Paint is slower than recommended. Consider optimizing image sizes, reducing server response times, and minimizing render-blocking resources.',
        webUrl: 'https://www.examplewebsite.com',
        status: 'error',
        score: 1.2,
        scorePercent: 24,
        scoreUnit: 's',
        branch: null,
        module: null,
    },
    {
        _id: 'A15',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Lighthouse',
        category: 'largest-contentful-paint',
        title: 'Largest Contentful Paint',
        description:
            'Measures how long it takes for the largest piece of content (text or image) to appear on the screen.',
        explanation:
            'Largest Contentful Paint is slower than recommended. Consider optimizing image sizes, reducing server response times, and minimizing render-blocking resources.',
        webUrl: 'https://www.examplewebsite.com',
        status: 'warning',
        score: 2.8,
        scorePercent: 56,
        scoreUnit: 's',
        branch: null,
        module: null,
    },
    {
        _id: 'A16',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Lighthouse',
        category: 'cumulative-layout-shift',
        title: 'Cumulative Layout Shift',
        description:
            "Measures how much the layout of your page shifts unexpectedly while it's loading.",
        explanation: null,
        webUrl: 'https://www.examplewebsite.com',
        status: 'success',
        score: 0.05,
        scorePercent: 5,
        scoreUnit: '',
        branch: null,
        module: null,
    },
    {
        _id: 'A17',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Security',
        category: 'xss-vulnerability',
        title: 'Potential XSS vulnerability detected',
        description: 'UserInput is not properly sanitized before being rendered in the DOM',
        explanation:
            'This vulnerability allows attackers to inject malicious scripts into your website, potentially compromising user data or taking control of their sessions.',
        webUrl: 'https://github.com/project/repo/blob/main/vulnerable.js#L12',
        status: 'error',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/index.js',
    },
    {
        _id: 'A18',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Compliance',
        category: 'unused-variable',
        title: 'Unused variable detected',
        description: 'The variable "unusedVar" is declared but never used.',
        explanation:
            'Unused variables can clutter the code and potentially lead to confusion. Consider removing them.',
        webUrl: 'https://github.com/project/repo/blob/main/code.js#L5',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/components/ListView.jsx',
    },
    {
        _id: 'A19',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Complexity',
        category: 'cyclomatic-complexity',
        title: 'Function is too complex',
        description:
            'The function "calculateTotals" has a high cyclomatic complexity, making it difficult to understand and maintain.',
        explanation:
            'Consider refactoring this function into smaller, more manageable parts to improve readability and maintainability.',
        webUrl: 'https://github.com/project/repo/blob/main/code.js#L25',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/components/ListView.jsx',
    },
    {
        _id: 'A20',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Complexity',
        category: 'maintainability-index',
        title: 'Low maintainability',
        description:
            'The function "calculateTotals" has a low maintainability index, indicating it may be difficult to modify or update.',
        explanation:
            'Consider refactoring this function to improve its maintainability score. This could involve simplifying the logic, reducing its size, or improving its commenting.',
        webUrl: 'https://github.com/project/repo/blob/main/code.js#L25',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/components/ListView.jsx',
    },
    {
        _id: 'A21',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Duplication',
        category: 'repeated-code-block',
        title: 'Repeated code block detected',
        description: 'The code block for handling user input is duplicated in multiple places.',
        explanation:
            'Duplicated code makes maintenance more difficult and increases the risk of errors. Consider refactoring to extract the duplicated code into a reusable function or component.',
        webUrl: 'https://github.com/project/repo/blob/main/code.js#L50,L75',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/components/DialogView.jsx',
    },
    {
        _id: 'A22',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Coupling',
        category: 'afferent-coupling',
        title: 'High afferent coupling',
        description:
            'The "user" module is used by many other modules, making it a potential bottleneck for changes.',
        explanation:
            'Consider refactoring to reduce the number of modules that depend on the "user" module. This could involve extracting common functionality into a separate module or redesigning the module interfaces.',
        webUrl: 'https://github.com/project/repo/blob/main/user.js',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/components/DialogView.jsx',
    },
    {
        _id: 'A23',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Coupling',
        category: 'efferent-coupling',
        title: 'High efferent coupling',
        description:
            'The "user" module depends on many other modules, making it potentially fragile to changes in those modules.',
        explanation:
            'Consider refactoring to reduce the number of modules that the "user" module depends on. This could involve extracting common functionality into a separate module or redesigning the module interfaces.',
        webUrl: 'https://github.com/project/repo/blob/main/user.js',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/components/DialogView.jsx', // Placeholder for missing module value
    },
    {
        _id: 'A24',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Coupling',
        category: 'instability-index',
        title: 'High instability',
        description:
            'The "user" module has a high instability index, indicating it\'s likely to be affected by changes in other modules.',
        explanation:
            'Consider refactoring to reduce the number of modules that depend on the "user" module. This could involve extracting common functionality into a separate module or redesigning the module interfaces.',
        webUrl: 'https://github.com/project/repo/blob/main/user.js',
        status: 'warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/pages/LoginPage.jsx', // Placeholder for missing module value
    },
    {
        _id: 'A25',
        appId: '20b20b20b20b20b20b20b20b',
        subCategory: null,
        type: 'Code Coupling',
        category: 'circular-dependencies',
        title: 'Circular dependencies detected',
        description:
            'There are circular dependencies between modules, which can make the code difficult to understand and maintain.',
        explanation:
            'Consider refactoring to eliminate circular dependencies. This might involve restructuring the code or introducing dependency injection.',
        webUrl: 'https://github.com/project/repo/blob/main/user.js',
        status: 'Warning',
        score: 0,
        scorePercent: 0,
        scoreUnit: '',
        branch: 'main',
        module: 'apps/frontend/src/pages/LogOutPage.jsx', // Placeholder for missing module value
    },
];

export const keywords = [
    {
        // static parts (BO)
        _id: '1a1a1a1a1a1a1a1a1a1a1a1a',
        evolutionId: 'A8901WXZSX1c1c1c1c1c1c1c1c1c',
        helpMessage: 'This project uses Angular (12.0.0)',
        label: 'Angular',
        version: '12.0.0',
        // error, success, warning
        status: 'error',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '2a2a2a2a2a2a2a2a2a2a2a2a',
        evolutionId: 'B8904WXZSX1c1c1c1c1c1c1c1c1c',
        helpMessage: 'This project uses NGRX (11.1.0)',
        label: 'NGRX',
        version: '11.1.0',
        // error, success, warning
        status: 'success',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '3a3a3a3a3a3a3a3a3a3a3a3a',
        evolutionId: 'C8901WXZSX1c1c1c1c1c2d1d1d',
        helpMessage: 'This project uses RxJS (6.6.7)',
        label: 'RxJS',
        version: '6.6.7',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '4a4a4a4a4a4a4a4a4a4a4a4a',
        helpMessage: 'This project uses Vue (3.2.26)',
        label: 'Vue',
        version: '3.2.26',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '5a5a5a5a5a5a5a5a5a5a5a5a',
        helpMessage: 'This project uses Vuex (4.0.2)',
        label: 'Vuex',
        version: '4.0.2',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '6a6a6a6a6a6a6a6a6a6a6a6a',
        helpMessage: 'This project uses Vuetify (2.5.10)',
        label: 'Vuetify',
        version: '2.5.10',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '7a7a7a7a7a7a7a7a7a7a7a7a',
        helpMessage: 'This project uses React (17.0.2)',
        label: 'React',
        version: '17.0.2',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '8a8a8a8a8a8a8a8a8a8a8a8a',
        helpMessage: 'This project uses Redux (4.1.0)',
        label: 'Redux',
        version: '4.1.0',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '9a9a9a9a9a9a9a9a9a9a9a9a',
        helpMessage: 'This project uses Styled-Components (5.3.1)',
        label: 'Styled-Components',
        version: '5.3.1',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '10a10a10a10a10a10a10a10a',
        helpMessage: 'This project uses Next.js (11.1.0)',
        label: 'Next.js',
        version: '11.1.0',
        // error, success, warning
        status: 'success',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '11a11a11a11a11a11a11a11a',
        helpMessage: 'This project uses Tailwind CSS (2.2.16)',
        label: 'Tailwind CSS',
        version: '2.2.16',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '12a12a12a12a12a12a12a12a',
        helpMessage: 'This project uses React-Hook-Form (7.15.3)',
        label: 'React-Hook-Form',
        version: '7.15.3',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '14a14a14a14a14a14a14a14a',
        helpMessage: 'This project uses Firebase (9.0.0)',
        label: 'Firebase',
        version: '9.0.0',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
    {
        // static parts (BO)
        _id: '15a15a15a15a15a15a15a15a',
        helpMessage: 'This project uses React-Query (3.18.1)',
        label: 'React-Query',
        version: '3.18.1',
        // error, success, warning
        status: 'warning',

        // dynamic parts
        apps: [
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'feature/customer-analytics',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'develop',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
            {
                appId: '20b20b20b20b20b20b20b20b',
                branch: 'main',
                module: 'front-js',
            },
        ],
    },
];

export const stats = [
    { keyword: 'React', total: 3 }, // Used in E-Commerce Platform, Learning Management System
    { keyword: 'Angular', total: 1 }, // Used in Smart Inventory Management System
    { keyword: 'NGRX', total: 1 }, // Used in Smart Inventory Management System
    { keyword: 'RxJS', total: 1 }, // Used in Smart Inventory Management System
    { keyword: 'Vue', total: 1 }, // Used in Healthcare Appointment System
    { keyword: 'Vuex', total: 1 }, // Used in Healthcare Appointment System
    { keyword: 'Vuetify', total: 1 }, // Used in Healthcare Appointment System
    { keyword: 'Redux', total: 1 }, // Used in E-Commerce Platform
    { keyword: 'Styled-Components', total: 1 }, // Used in E-Commerce Platform
    { keyword: 'Next.js', total: 1 }, // Used in Real Estate Portal
    { keyword: 'Tailwind CSS', total: 1 }, // Used in Real Estate Portal
    { keyword: 'React-Hook-Form', total: 1 }, // Used in Real Estate Portal
    { keyword: 'Firebase', total: 1 }, // Used in Learning Management System
    { keyword: 'React-Query', total: 1 }, // Used in Learning Management System
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
