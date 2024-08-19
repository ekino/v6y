/* eslint-disable max-lines */
export const auditsReports = [
    {
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

export const appList = [
    {
        _id: '20b20b20b20b20b20b20b20b',
        name: 'Advanced CRM System',
        mails: ['michael.scott@crmtech.com', 'michaelscott@gmail.com'],
        acronym: 'ACRMS',
        description:
            'A next-generation CRM system designed for small to large enterprises, featuring a React frontend and a Spring Boot backend.',
        repo: {
            _id: '21c21c21c21c21c21c21c21c',
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
                _id: '22d22d22d22d22d22d22d22d',
                type: 'help',
                label: 'Support Center',
                value: 'https://help.crmtech.app',
                description: 'Get assistance with your CRM system.',
            },
            {
                _id: '22d22d22d22d22d22d22d22e',
                type: 'doc',
                label: 'Developer Documentation',
                value: 'https://help.crmtech.app',
            },
            {
                _id: '22d22d22d22d22d22d22d22f',
                type: 'repo',
                label: 'Repository',
                value: 'https://github.com/CRMTech/crm-system',
                description: 'Access the source code repository on GitHub.',
            },
            {
                _id: '22d22d22d22d22d22d22d230',
                type: 'ci-cd',
                label: 'CI/CD Pipeline',
                value: 'https://ci.crmtech.app',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                _id: '22d22d22d22d22d22d22d231',
                type: 'dashboard',
                label: 'Project Dashboard',
                value: 'https://dashboard.crmtech.app',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
        keywords: [
            {
                _id: '6789',
                type: 'frontend',
                branch: 'feature/customer-analytics',
                label: 'React (17.0.2)',
                status: 'warning',
                helpMessage:
                    "Identifies the frontend type and version, indicating if it's up-to-date or needs attention.",
            },
            {
                _id: '67891c1c1c1c1c1c1c1c1c1c',
                type: 'frontend',
                branch: 'develop',
                label: 'React (16.18.0)',
                status: 'error',
                helpMessage:
                    "Identifies the frontend type and version, indicating if it's up-to-date or needs attention.",
            },
            {
                _id: '6789A1c1c1c1c1c1c1c1c1c1c',
                type: 'frontend',
                branch: 'main',
                label: 'Webpack (5.0.0)',
                status: 'success',
                helpMessage: 'Highlights the version of Webpack being used, along with its status.',
            },
            {
                _id: '67891C1c1c1c1c1c1c1c1c1c',
                type: 'frontend',
                branch: 'main',
                label: 'Material-UI (4.12.3)',
                status: 'success',
                helpMessage:
                    'Highlights the UI library used in the frontend, with its current version and status.',
            },
        ],
        qualityGates: [
            {
                _id: '78901GG1c1c1c1c1c1c1c1c1c',
                label: 'Lint-Quality',
                module: 'front-js',
                status: 'error',
                branch: 'main',
                errorDetails:
                    'Linting issues detected in the JavaScript frontend code. Action required to fix the errors.',
            },
            {
                _id: '78903GG1c1c1c1c1c1c1c1c1c',
                label: 'Performance',
                module: 'full-stack',
                status: 'warning',
                branch: 'main',
                errorDetails:
                    'Performance tests show some degradation in response times. Further analysis is needed.',
            },
            {
                _id: '78905GG1c1c1c1c1c1c1c1c1c',
                label: 'Bundle-Quality',
                module: 'front-js',
                status: 'success',
                branch: 'main',
                errorDetails: 'Frontend bundle size is within acceptable limits.',
            },
        ],
        evolutions: [
            {
                _id: '8901WXZSX1c1c1c1c1c1c1c1c1c',
                title: 'Customer Analytics Dashboard',
                status: 'critical',
                type: 'frontend',
                branch: 'feature/customer-analytics',
                description:
                    'A new customer analytics dashboard has been implemented, providing insights into customer behavior and trends.',
                docLinks: [
                    {
                        _id: 'ZXWYX',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://github.com/CRMTech/crm-system',
                    },
                    {
                        _id: '22d22d22d22d22d22d22d22f',
                        type: 'repo',
                        label: 'Repository',
                        value: 'https://github.com/CRMTech/crm-system',
                        description: 'Access the source code repository on GitHub.',
                    },
                ],
            },
            {
                _id: '8904WXZSX1c1c1c1c1c1c1c1c1c',
                title: 'Material-UI Update',
                type: 'frontend',
                status: 'important',
                branch: 'main',
                description:
                    'Material-UI library has been updated to the latest stable version to enhance UI consistency and performance.',
                docLinks: [
                    {
                        _id: 'ZXWYZ2',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://github.com/CRMTech/crm-system',
                    },
                ],
            },
            {
                _id: '8901WXZSX1c1c1c1c1c2d1d1d',
                title: 'Task Tracking Feature',
                type: 'frontend',
                status: 'recommended',
                branch: 'feature/task-tracking',
                description:
                    'A new task tracking feature has been added, allowing users to manage tasks more effectively.',
                docLinks: [
                    {
                        _id: 'ZXWYZ5',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://docs.pmtool.com',
                    },
                ],
            },
        ],
        dependencies: [
            {
                _id: '1c1c1c1c1c1c1c1c1c1c1c1c1c',
                type: 'frontend',
                branch: 'main',
                name: '@types/react',
                usedOnPath: 'modules/front-js',
                usedOnUrl:
                    'https://github.fr.world.socgen/AppliDigitalClient/bddf_awt_acf_acs/tree/master/modules/front-js',
                version: '17.0.39',
                status: 'up-to-date',
                recommendedVersion: '=17.0.39',
            },
            {
                _id: '3c3c3c3c3c3c3c3c3c3c3c3c3c',
                type: 'frontend',
                branch: 'feature/customer-analytics',
                name: 'd3',
                usedOnPath: 'modules/front-js',
                usedOnUrl: 'https://github.com/CRMTech/crm-system',
                version: '6.7.0',
                status: 'up-to-date',
                recommendedVersion: '=6.7.0',
            },
            {
                _id: '4c4c4c4c4c4c4c4c4c4c4c4c4c',
                type: 'frontend',
                branch: 'main',
                name: 'axios',
                usedOnPath: 'modules/front-js',
                usedOnUrl: 'https://github.com/CRMTech/crm-system',
                version: '=0.21.1',
                status: 'deprecated',
                recommendedVersion: '=0.23.0',
                help: {
                    title: 'Deprecated Module',
                    description:
                        'The axios version used is deprecated. Upgrade to version 0.23.0 for enhanced security and performance.',
                    docLinks: [
                        {
                            _id: 'YXWZ3',
                            type: 'doc',
                            label: 'More Information',
                            value: 'https://github.com/axios/axios',
                        },
                    ],
                },
            },
        ],
    },
    {
        _id: '20b20b20b20b20b20b20b20c',
        name: 'E-commerce Platform',
        mails: ['john.doe@ecommerce.com', 'johndoe@gmail.com'],
        acronym: 'ECP',
        description:
            'A comprehensive e-commerce platform with features for product management, user accounts, and order processing.',
        repo: {
            _id: '21c21c21c21c21c21c21c21d',
            name: 'ecommerce-platform',
            fullName: 'ECommerceCo/ecommerce-platform',
            owner: 'ECommerceCo',
            webUrl: 'https://github.com/ECommerceCo/ecommerce-platform',
            gitUrl: 'git@github.com:ECommerceCo/ecommerce-platform.git',
            allBranches: [
                'main',
                'develop',
                'feature/product-management',
                'feature/payment-gateway',
            ],
        },
        links: [
            {
                _id: '22d22d22d22d22d22d22d22g',
                type: 'help',
                label: 'Support Center',
                value: 'https://support.ecommerce.com',
                description: 'Get assistance with your e-commerce platform.',
            },
            {
                _id: '22d22d22d22d22d22d22d22h',
                type: 'doc',
                label: 'Developer Documentation',
                value: 'https://docs.ecommerce.com',
            },
            {
                _id: '22d22d22d22d22d22d22d22i',
                type: 'repo',
                label: 'Repository',
                value: 'https://github.com/ECommerceCo/ecommerce-platform',
                description: 'Access the source code repository on GitHub.',
            },
            {
                _id: '22d22d22d22d22d22d22d232',
                type: 'ci-cd',
                label: 'CI/CD Pipeline',
                value: 'https://ci.ecommerce.com',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                _id: '22d22d22d22d22d22d22d233',
                type: 'dashboard',
                label: 'Project Dashboard',
                value: 'https://dashboard.ecommerce.com',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
        keywords: [
            {
                _id: '7890',
                type: 'backend',
                branch: 'main',
                label: 'Spring Boot (2.7.0)',
                status: 'success',
                helpMessage: 'Identifies the backend framework and version used.',
            },
            {
                _id: '78901c1c1c1c1c1c1c1c1c1d',
                type: 'frontend',
                branch: 'feature/product-management',
                label: 'Angular (12.2.5)',
                status: 'warning',
                helpMessage: 'Identifies the frontend framework and version used.',
            },
            {
                _id: '7890A1c1c1c1c1c1c1c1c1d',
                type: 'backend',
                branch: 'main',
                label: 'Hibernate (5.6.4)',
                status: 'success',
                helpMessage: 'Highlights the ORM library used in the backend.',
            },
        ],
        qualityGates: [
            {
                _id: '78901GG1c1c1c1c1c1c1c2c1c',
                label: 'Lint-Quality',
                module: 'back-java',
                status: 'success',
                branch: 'main',
                errorDetails: 'No linting issues detected in the Java backend code.',
            },
            {
                _id: '78903GG1c1c1c1c1c1c1c2c1c',
                label: 'Performance',
                module: 'full-stack',
                status: 'warning',
                branch: 'main',
                errorDetails: 'Performance tests indicate some areas for improvement.',
            },
        ],
        evolutions: [
            {
                _id: '8901WXZSX1c1c1c1c1c1d1d1d',
                title: 'Product Management Module',
                type: 'backend',
                status: 'critical',
                branch: 'feature/product-management',
                description:
                    'A new module for managing product listings and categories has been added.',
                docLinks: [
                    {
                        _id: 'ZXWYZ4',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://docs.ecommerce.com',
                    },
                ],
            },
        ],
        dependencies: [
            {
                _id: '5d5d5d5d5d5d5d5d5d5d5d5d5d',
                type: 'backend',
                branch: 'main',
                name: 'spring-boot-starter-web',
                usedOnPath: 'src/main/java/com/ecommerce',
                usedOnUrl: 'https://github.com/ECommerceCo/ecommerce-platform',
                version: '2.7.0',
                status: 'up-to-date',
                recommendedVersion: '=2.7.0',
            },
            {
                _id: '6d6d6d6d6d6d6d6d6d6d6d6d6d',
                type: 'frontend',
                branch: 'feature/product-management',
                name: '@angular/core',
                usedOnPath: 'src/app',
                usedOnUrl: 'https://github.com/ECommerceCo/ecommerce-platform',
                version: '12.2.5',
                status: 'up-to-date',
                recommendedVersion: '=12.2.5',
            },
        ],
    },
    {
        _id: '20b20b20b20b20b20b20b20d',
        name: 'Project Management Tool',
        mails: ['susan.barker@pmtool.com', 'susanbarker@gmail.com'],
        acronym: 'PMT',
        description:
            'An advanced project management tool with features like task tracking, team collaboration, and project analytics.',
        repo: {
            _id: '21c21c21c21c21c21c21c21e',
            name: 'pm-tool',
            fullName: 'ProjectTools/pm-tool',
            owner: 'ProjectTools',
            webUrl: 'https://github.com/ProjectTools/pm-tool',
            gitUrl: 'git@github.com:ProjectTools/pm-tool.git',
            allBranches: ['main', 'develop', 'feature/task-tracking', 'feature/collaboration'],
        },
        links: [
            {
                _id: '22d22d22d22d22d22d22d22j',
                type: 'help',
                label: 'Support Center',
                value: 'https://support.pmtool.com',
                description: 'Get assistance with your project management tool.',
            },
            {
                _id: '22d22d22d22d22d22d22d22k',
                type: 'doc',
                label: 'Developer Documentation',
                value: 'https://docs.pmtool.com',
            },
            {
                _id: '22d22d22d22d22d22d22d22l',
                type: 'repo',
                label: 'Repository',
                value: 'https://github.com/ProjectTools/pm-tool',
                description: 'Access the source code repository on GitHub.',
            },
            {
                _id: '22d22d22d22d22d22d22d234',
                type: 'ci-cd',
                label: 'CI/CD Pipeline',
                value: 'https://ci.pmtool.com',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                _id: '22d22d22d22d22d22d22d235',
                type: 'dashboard',
                label: 'Project Dashboard',
                value: 'https://dashboard.pmtool.com',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
        keywords: [
            {
                _id: '8900',
                type: 'frontend',
                branch: 'feature/task-tracking',
                label: 'Vue.js (3.2.0)',
                status: 'success',
                helpMessage: 'Identifies the frontend framework and version used.',
            },
            {
                _id: '89001c1c1c1c1c1c1c1c1c2d',
                type: 'backend',
                branch: 'main',
                label: 'Node.js (16.14.2)',
                status: 'success',
                helpMessage: 'Identifies the backend runtime and version used.',
            },
            {
                _id: '8900A1c1c1c1c1c1c1c1c2d',
                type: 'frontend',
                branch: 'main',
                label: 'Tailwind CSS (2.2.19)',
                status: 'success',
                helpMessage: 'Highlights the CSS framework used in the frontend.',
            },
        ],
        qualityGates: [
            {
                _id: '78901GG1c1c1c1c1c1c3c1c1c',
                label: 'Lint-Quality',
                module: 'front-js',
                status: 'success',
                branch: 'main',
                errorDetails: 'No linting issues detected in the frontend JavaScript code.',
            },
            {
                _id: '78903GG1c1c1c1c1c1c3c1c1c',
                label: 'Performance',
                module: 'full-stack',
                status: 'warning',
                branch: 'main',
                errorDetails: 'Performance tests indicate some areas for improvement.',
            },
        ],
        evolutions: [
            {
                _id: '8901WXZSX1c1c1c1c1c2d1d1d',
                title: 'Task Tracking Feature',
                type: 'frontend',
                status: 'important',
                branch: 'feature/task-tracking',
                description:
                    'A new task tracking feature has been added, allowing users to manage tasks more effectively.',
                docLinks: [
                    {
                        _id: 'ZXWYZ5',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://docs.pmtool.com',
                    },
                ],
            },
        ],
        dependencies: [
            {
                _id: '7d7d7d7d7d7d7d7d7d7d7d7d7d',
                type: 'frontend',
                branch: 'main',
                name: 'vue',
                usedOnPath: 'src/components',
                usedOnUrl: 'https://github.com/ProjectTools/pm-tool',
                version: '3.2.0',
                status: 'up-to-date',
                recommendedVersion: '=3.2.0',
            },
            {
                _id: '8d8d8d8d8d8d8d8d8d8d8d8d8d',
                type: 'backend',
                branch: 'main',
                name: 'express',
                usedOnPath: 'src/server',
                usedOnUrl: 'https://github.com/ProjectTools/pm-tool',
                version: '4.17.1',
                status: 'up-to-date',
                recommendedVersion: '=4.17.1',
            },
        ],
    },
    {
        _id: '20b20b20b20b20b20b20b20e',
        name: 'Social Media Analytics',
        mails: ['alice.smith@socialanalytics.com', 'alicesmith@gmail.com'],
        acronym: 'SMA',
        description:
            'A tool for analyzing social media data with visualizations and reporting features.',
        repo: {
            _id: '21c21c21c21c21c21c21c21f',
            name: 'social-analytics',
            fullName: 'SocialAnalyticsCo/social-analytics',
            owner: 'SocialAnalyticsCo',
            webUrl: 'https://github.com/SocialAnalyticsCo/social-analytics',
            gitUrl: 'git@github.com:SocialAnalyticsCo/social-analytics.git',
            allBranches: ['main', 'develop', 'feature/visualizations', 'feature/reports'],
        },
        links: [
            {
                _id: '22d22d22d22d22d22d22d22m',
                type: 'help',
                label: 'Support Center',
                value: 'https://support.socialanalytics.com',
                description: 'Get assistance with your social media analytics tool.',
            },
            {
                _id: '22d22d22d22d22d22d22d22n',
                type: 'doc',
                label: 'Developer Documentation',
                value: 'https://docs.socialanalytics.com',
            },
            {
                _id: '22d22d22d22d22d22d22d22o',
                type: 'repo',
                label: 'Repository',
                value: 'https://github.com/SocialAnalyticsCo/social-analytics',
                description: 'Access the source code repository on GitHub.',
            },
            {
                _id: '22d22d22d22d22d22d22d236',
                type: 'ci-cd',
                label: 'CI/CD Pipeline',
                value: 'https://ci.socialanalytics.com',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                _id: '22d22d22d22d22d22d22d237',
                type: 'dashboard',
                label: 'Project Dashboard',
                value: 'https://dashboard.socialanalytics.com',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
        keywords: [
            {
                _id: '9010',
                type: 'frontend',
                branch: 'feature/visualizations',
                label: 'React (18.0.0)',
                status: 'success',
                helpMessage: 'Identifies the frontend framework and version used.',
            },
            {
                _id: '90101c1c1c1c1c1c1c1c1d3e',
                type: 'backend',
                branch: 'main',
                label: 'Django (4.1.1)',
                status: 'success',
                helpMessage: 'Identifies the backend framework and version used.',
            },
            {
                _id: '9010A1c1c1c1c1c1c1c1d3e',
                type: 'frontend',
                branch: 'main',
                label: 'Chart.js (3.8.0)',
                status: 'success',
                helpMessage: 'Highlights the charting library used for data visualizations.',
            },
        ],
        qualityGates: [
            {
                _id: '78901GG1c1c1c1c1c1c4c1c1c',
                label: 'Lint-Quality',
                module: 'front-js',
                status: 'success',
                branch: 'main',
                errorDetails: 'No linting issues detected in the frontend JavaScript code.',
            },
            {
                _id: '78903GG1c1c1c1c1c1c4c1c1c',
                label: 'Performance',
                module: 'full-stack',
                status: 'warning',
                branch: 'main',
                errorDetails: 'Performance tests indicate some areas for improvement.',
            },
        ],
        evolutions: [
            {
                _id: '8901WXZSX1c1c1c1c1c3e1e1e',
                title: 'Enhanced Visualizations',
                type: 'frontend',
                status: 'important',
                branch: 'feature/visualizations',
                description: 'New visualization options have been added for better data insights.',
                docLinks: [
                    {
                        _id: 'ZXWYZ6',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://docs.socialanalytics.com',
                    },
                ],
            },
        ],
        dependencies: [
            {
                _id: '9d9d9d9d9d9d9d9d9d9d9d9d9d',
                type: 'frontend',
                branch: 'main',
                name: 'chart.js',
                usedOnPath: 'src/components',
                usedOnUrl: 'https://github.com/SocialAnalyticsCo/social-analytics',
                version: '3.8.0',
                status: 'up-to-date',
                recommendedVersion: '=3.8.0',
            },
            {
                _id: '0d0d0d0d0d0d0d0d0d0d0d0d0d',
                type: 'backend',
                branch: 'main',
                name: 'django',
                usedOnPath: 'src/backend',
                usedOnUrl: 'https://github.com/SocialAnalyticsCo/social-analytics',
                version: '4.1.1',
                status: 'up-to-date',
                recommendedVersion: '=4.1.1',
            },
        ],
    },
    {
        _id: '20b20b20b20b20b20b20b20f',
        name: 'Health Monitoring System',
        mails: ['charlie.jones@healthmonitor.com', 'charliejones@gmail.com'],
        acronym: 'HMS',
        description:
            'A system for monitoring and managing patient health data with real-time alerts and reports.',
        repo: {
            _id: '21c21c21c21c21c21c21c21g',
            name: 'health-monitor',
            fullName: 'HealthTech/health-monitor',
            owner: 'HealthTech',
            webUrl: 'https://github.com/HealthTech/health-monitor',
            gitUrl: 'git@github.com:HealthTech/health-monitor.git',
            allBranches: ['main', 'develop', 'feature/alerts', 'feature/reports'],
        },
        links: [
            {
                _id: '22d22d22d22d22d22d22d22p',
                type: 'help',
                label: 'Support Center',
                value: 'https://support.healthmonitor.com',
                description: 'Get assistance with your health monitoring system.',
            },
            {
                _id: '22d22d22d22d22d22d22d22q',
                type: 'doc',
                label: 'Developer Documentation',
                value: 'https://docs.healthmonitor.com',
            },
            {
                _id: '22d22d22d22d22d22d22d22r',
                type: 'repo',
                label: 'Repository',
                value: 'https://github.com/HealthTech/health-monitor',
                description: 'Access the source code repository on GitHub.',
            },
            {
                _id: '22d22d22d22d22d22d22d238',
                type: 'ci-cd',
                label: 'CI/CD Pipeline',
                value: 'https://ci.healthmonitor.com',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                _id: '22d22d22d22d22d22d22d239',
                type: 'dashboard',
                label: 'Project Dashboard',
                value: 'https://dashboard.healthmonitor.com',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
        keywords: [
            {
                _id: '9020',
                type: 'backend',
                branch: 'feature/alerts',
                label: 'Spring Boot (2.7.1)',
                status: 'success',
                helpMessage: 'Identifies the backend framework and version used.',
            },
            {
                _id: '90201c1c1c1c1c1c1c1c1d4f',
                type: 'frontend',
                branch: 'main',
                label: 'React (18.0.0)',
                status: 'success',
                helpMessage: 'Identifies the frontend framework and version used.',
            },
            {
                _id: '9020A1c1c1c1c1c1c1c1d4f',
                type: 'backend',
                branch: 'main',
                label: 'PostgreSQL (13.5)',
                status: 'success',
                helpMessage: 'Highlights the database system used in the backend.',
            },
        ],
        qualityGates: [
            {
                _id: '78901GG1c1c1c1c1c1c5c1c1c',
                label: 'Lint-Quality',
                module: 'back-java',
                status: 'success',
                branch: 'main',
                errorDetails: 'No linting issues detected in the Java backend code.',
            },
            {
                _id: '78903GG1c1c1c1c1c1c5c1c1c',
                label: 'Performance',
                module: 'full-stack',
                status: 'warning',
                branch: 'main',
                errorDetails: 'Performance tests indicate some areas for improvement.',
            },
        ],
        evolutions: [
            {
                _id: '8901WXZSX1c1c1c1c1c4f1f1f',
                title: 'Real-Time Alerts',
                type: 'backend',
                status: 'recommended',
                branch: 'feature/alerts',
                description:
                    'Real-time alerts feature has been implemented for immediate patient notifications.',
                docLinks: [
                    {
                        _id: 'ZXWYZ7',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://docs.healthmonitor.com',
                    },
                ],
            },
        ],
        dependencies: [
            {
                _id: '1e1e1e1e1e1e1e1e1e1e1e1e1e',
                type: 'backend',
                branch: 'main',
                name: 'spring-boot-starter-web',
                usedOnPath: 'src/main/java/com/healthmonitor',
                usedOnUrl: 'https://github.com/HealthTech/health-monitor',
                version: '2.7.1',
                status: 'up-to-date',
                recommendedVersion: '=2.7.1',
            },
            {
                _id: '2e2e2e2e2e2e2e2e2e2e2e2e2e',
                type: 'frontend',
                branch: 'main',
                name: 'react',
                usedOnPath: 'src/app',
                usedOnUrl: 'https://github.com/HealthTech/health-monitor',
                version: '18.0.0',
                status: 'up-to-date',
                recommendedVersion: '=18.0.0',
            },
        ],
    },
    {
        _id: '20b20b20b20b20b20b20b20g',
        name: 'Inventory Management System',
        mails: ['david.wilson@inventorymgmt.com', 'davidwilson@gmail.com'],
        acronym: 'IMS',
        description:
            'A comprehensive inventory management system for tracking and managing stock levels, orders, and suppliers.',
        repo: {
            _id: '21c21c21c21c21c21c21c21h',
            name: 'inventory-management',
            fullName: 'InventoryCo/inventory-management',
            owner: 'InventoryCo',
            webUrl: 'https://github.com/InventoryCo/inventory-management',
            gitUrl: 'git@github.com:InventoryCo/inventory-management.git',
            allBranches: [
                'main',
                'develop',
                'feature/order-management',
                'feature/supplier-management',
            ],
        },
        links: [
            {
                _id: '22d22d22d22d22d22d22d22r',
                type: 'help',
                label: 'Support Center',
                value: 'https://support.inventorymgmt.com',
                description: 'Get assistance with your inventory management system.',
            },
            {
                _id: '22d22d22d22d22d22d22d22s',
                type: 'doc',
                label: 'Developer Documentation',
                value: 'https://docs.inventorymgmt.com',
            },
            {
                _id: '22d22d22d22d22d22d22d22t',
                type: 'repo',
                label: 'Repository',
                value: 'https://github.com/InventoryCo/inventory-management',
                description: 'Access the source code repository on GitHub.',
            },
            {
                _id: '22d22d22d22d22d22d22d240',
                type: 'ci-cd',
                label: 'CI/CD Pipeline',
                value: 'https://ci.inventorymgmt.com',
                description: 'Monitor the continuous integration and delivery pipeline.',
            },
            {
                _id: '22d22d22d22d22d22d22d241',
                type: 'dashboard',
                label: 'Project Dashboard',
                value: 'https://dashboard.inventorymgmt.com',
                description: 'View project metrics and status on the dashboard.',
            },
        ],
        keywords: [
            {
                _id: '9030',
                type: 'backend',
                branch: 'main',
                label: 'Spring Boot (2.7.2)',
                status: 'success',
                helpMessage: 'Identifies the backend framework and version used.',
            },
            {
                _id: '90301c1c1c1c1c1c1c1c1d5g',
                type: 'frontend',
                branch: 'main',
                label: 'Vue.js (3.2.5)',
                status: 'success',
                helpMessage: 'Identifies the frontend framework and version used.',
            },
            {
                _id: '9030A1c1c1c1c1c1c1c1d5g',
                type: 'backend',
                branch: 'main',
                label: 'MySQL (8.0.26)',
                status: 'success',
                helpMessage: 'Highlights the database system used in the backend.',
            },
        ],
        qualityGates: [
            {
                _id: '78901GG1c1c1c1c1c1c6c1c1c',
                label: 'Lint-Quality',
                module: 'back-java',
                status: 'success',
                branch: 'main',
                errorDetails: 'No linting issues detected in the Java backend code.',
            },
            {
                _id: '78903GG1c1c1c1c1c1c6c1c1c',
                label: 'Performance',
                module: 'full-stack',
                status: 'warning',
                branch: 'main',
                errorDetails: 'Performance tests indicate some areas for improvement.',
            },
        ],
        evolutions: [
            {
                _id: '8901WXZSX1c1c1c1c1c5g1g1g',
                title: 'Order Management System',
                type: 'backend',
                status: 'recommended',
                branch: 'feature/order-management',
                description:
                    'An order management system has been added to track and manage orders.',
                docLinks: [
                    {
                        _id: 'ZXWYZ8',
                        type: 'doc',
                        label: 'More Information',
                        value: 'https://docs.inventorymgmt.com',
                    },
                ],
            },
        ],
        dependencies: [
            {
                _id: '3e3e3e3e3e3e3e3e3e3e3e3e3e',
                type: 'backend',
                branch: 'main',
                name: 'spring-boot-starter-web',
                usedOnPath: 'src/main/java/com/inventorymgmt',
                usedOnUrl: 'https://github.com/InventoryCo/inventory-management',
                version: '2.7.2',
                status: 'up-to-date',
                recommendedVersion: '=2.7.2',
            },
            {
                _id: '4e4e4e4e4e4e4e4e4e4e4e4e4e',
                type: 'frontend',
                branch: 'main',
                name: 'vue',
                usedOnPath: 'src/components',
                usedOnUrl: 'https://github.com/InventoryCo/inventory-management',
                version: '3.2.5',
                status: 'up-to-date',
                recommendedVersion: '=3.2.5',
            },
        ],
    },
];

export const keywords = [
    // Smart Inventory Management System
    {
        _id: '1a1a1a1a1a1a1a1a1a1a1a1a',
        branch: 'main',
        status: 'success',
        helpMessage: 'This project uses Angular (12.0.0)',
        label: 'Angular (12.0.0)',
        type: 'frontend',
    },
    {
        _id: '2a2a2a2a2a2a2a2a2a2a2a2a',
        branch: 'feature/ai-forecasting',
        status: 'success',
        helpMessage: 'This project uses NGRX (11.1.0)',
        label: 'NGRX (11.1.0)',
        type: 'frontend',
    },
    {
        _id: '3a3a3a3a3a3a3a3a3a3a3a3a',
        branch: 'develop',
        status: 'warning',
        helpMessage: 'This project uses RxJS (6.6.7)',
        label: 'RxJS (6.6.7)',
        type: 'frontend',
    },

    // Healthcare Appointment System
    {
        _id: '4a4a4a4a4a4a4a4a4a4a4a4a',
        branch: 'main',
        status: 'success',
        helpMessage: 'This project uses Vue (3.2.26)',
        label: 'Vue (3.2.26)',
        type: 'frontend',
    },
    {
        _id: '5a5a5a5a5a5a5a5a5a5a5a5a',
        branch: 'develop',
        status: 'success',
        helpMessage: 'This project uses Vuex (4.0.2)',
        label: 'Vuex (4.0.2)',
        type: 'frontend',
    },
    {
        _id: '6a6a6a6a6a6a6a6a6a6a6a6a',
        branch: 'feature/payment-integration',
        status: 'error',
        helpMessage: 'This project uses Vuetify (2.5.10)',
        label: 'Vuetify (2.5.10)',
        type: 'frontend',
    },

    // E-Commerce Platform
    {
        _id: '7a7a7a7a7a7a7a7a7a7a7a7a',
        branch: 'main',
        status: 'success',
        helpMessage: 'This project uses React (17.0.2)',
        label: 'React (17.0.2)',
        type: 'frontend',
    },
    {
        _id: '8a8a8a8a8a8a8a8a8a8a8a8a',
        branch: 'develop',
        status: 'success',
        helpMessage: 'This project uses Redux (4.1.0)',
        label: 'Redux (4.1.0)',
        type: 'frontend',
    },
    {
        _id: '9a9a9a9a9a9a9a9a9a9a9a9a',
        branch: 'feature/recommendation-system',
        status: 'success',
        helpMessage: 'This project uses Styled-Components (5.3.1)',
        label: 'Styled-Components (5.3.1)',
        type: 'frontend',
    },

    // Real Estate Portal
    {
        _id: '10a10a10a10a10a10a10a10a',
        branch: 'main',
        status: 'success',
        helpMessage: 'This project uses Next.js (11.1.0)',
        label: 'Next.js (11.1.0)',
        type: 'frontend',
    },
    {
        _id: '11a11a11a11a11a11a11a11a',
        branch: 'develop',
        status: 'success',
        helpMessage: 'This project uses Tailwind CSS (2.2.16)',
        label: 'Tailwind CSS (2.2.16)',
        type: 'frontend',
    },
    {
        _id: '12a12a12a12a12a12a12a12a',
        branch: 'feature/advanced-search',
        status: 'success',
        helpMessage: 'This project uses React-Hook-Form (7.15.3)',
        label: 'React-Hook-Form (7.15.3)',
        type: 'frontend',
    },

    // Learning Management System
    {
        _id: '13a13a13a13a13a13a13a13a',
        branch: 'main',
        status: 'success',
        helpMessage: 'This project uses React (17.0.2)',
        label: 'React (17.0.2)',
        type: 'frontend',
    },
    {
        _id: '14a14a14a14a14a14a14a14a',
        branch: 'develop',
        status: 'success',
        helpMessage: 'This project uses Firebase (9.0.0)',
        label: 'Firebase (9.0.0)',
        type: 'frontend',
    },
    {
        _id: '15a15a15a15a15a15a15a15a',
        branch: 'feature/quiz-module',
        status: 'success',
        helpMessage: 'This project uses React-Query (3.18.1)',
        label: 'React-Query (3.18.1)',
        type: 'frontend',
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
        title: 'Unlocking Codebase Performance with Vitality',
        color: '13',
        description:
            'Discover how Vitality identifies bottlenecks, optimizes resource usage, and enhances the overall health of your applications.',
        links: [
            {
                type: 'doc',
                label: 'Performance Optimization Guide',
                value: 'https://docs.vitality.app/performance',
            },
        ],
    },
    {
        title: 'Your Path to Smoother, Faster Applications',
        color: '13',
        description:
            'Learn how Vitality empowers developers to build and maintain high-quality applications that deliver exceptional user experiences.',
        links: [
            {
                type: 'doc',
                label: 'Get Started with Vitality',
                value: 'https://docs.vitality.app/getting-started',
            },
        ],
    },
    {
        title: 'Proactive Codebase Monitoring and Analysis',
        color: '13',
        description:
            "Explore Vitality's comprehensive suite of tools for real-time monitoring, automated analysis, and actionable insights into your codebase.",
        links: [
            {
                type: 'doc',
                label: 'Feature Overview',
                value: 'https://docs.vitality.app/features',
            },
        ],
    },
    {
        title: 'Why Vitality?',
        color: '13',
        description:
            'Understand the benefits of using Vitality to ensure your applications are robust, efficient, and scalable.',
        links: [
            {
                type: 'doc',
                label: 'Why Vitality?',
                value: 'https://docs.vitality.app/why-vitality',
            },
        ],
    },
    {
        title: 'Integrating Vitality into Your Workflow',
        color: '13',
        description:
            'See how easily Vitality integrates into your existing development pipeline, providing continuous feedback and improvement opportunities.',
        links: [
            {
                type: 'doc',
                label: 'Integration Guide',
                value: 'https://docs.vitality.app/integration',
            },
        ],
    },
    {
        title: 'Success Stories with Vitality',
        color: '13',
        description:
            "Read real-world case studies of how teams have used Vitality to achieve significant improvements in their applications' performance and maintainability.",
        links: [
            {
                type: 'doc',
                label: 'Case Studies',
                value: 'https://docs.vitality.app/case-studies',
            },
        ],
    },
];

export const notifications = [
    {
        title: 'Vitality Update Available!',
        color: '14',
        description:
            'Vitality v2.5 is now ready for download.  New features include enhanced performance monitoring and improved code analysis.',
        links: [
            {
                type: 'download',
                label: 'Update Now',
                value: 'https://downloads.vitality.app/v2.5',
            },
            {
                type: 'release-notes',
                label: 'Release Notes',
                value: 'https://docs.vitality.app/release-notes/v2.5',
            },
        ],
    },
    {
        title: 'Potential Performance Issue Detected',
        color: '14',
        description:
            'Vitality has identified a potential performance issue in your XYZ service. Please review the detailed report for recommendations.',
        links: [
            {
                type: 'report',
                label: 'View Report',
                value: 'https://app.vitality.app/reports/xyz-service-performance-issue',
            },
        ],
    },
    {
        title: 'Security Vulnerability Patched',
        color: '14',
        description:
            "A critical security vulnerability in Vitality's dependency library has been addressed. Please update to the latest version.",
        links: [
            {
                type: 'update',
                label: 'Update Instructions',
                value: 'https://docs.vitality.app/update-instructions',
            },
        ],
    },
    {
        title: 'New Tutorial: Optimizing Frontend Code',
        color: '14',
        description:
            "Our latest tutorial shows you how to leverage Vitality's insights to improve your frontend code's performance and maintainability.",
        links: [
            {
                type: 'tutorial',
                label: 'Read the Tutorial',
                value: 'https://docs.vitality.app/tutorials/frontend-optimization',
            },
        ],
    },
];

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

const frontendDeprecatedDeps = [
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
