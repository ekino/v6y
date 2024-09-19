export const securityAntiPatterns = [
    {
        antiPattern: 'findDOMNode',
        category: 'react-findDOMNode',
    },
    {
        antiPattern: 'createFactory',
        category: 'react-createFactory',
    },
    {
        antiPattern: 'createElement',
        category: 'react-createElement',
    },
    {
        antiPattern: 'findDOMNode',
        category: 'react-findDOMNode',
    },
    {
        antiPattern: 'cloneElement',
        category: 'react-dangerouslySetInnerHTML',
    },
    {
        antiPattern: 'useRef',
        category: 'react-useRef',
    },
    {
        antiPattern: 'createRef',
        category: 'react-createRef',
    },

    {
        antiPattern: 'bypassSecurityTrustHtml',
        category: 'angular-bypassSecurityTrustHtml',
    },
    {
        antiPattern: 'bypassSecurityTrustStyle',
        category: 'angular-bypassSecurityTrustStyle',
    },
    {
        antiPattern: 'bypassSecurityTrustScript',
        category: 'angular-bypassSecurityTrustScript',
    },
    {
        antiPattern: 'bypassSecurityTrustUrl',
        category: 'angular-bypassSecurityTrustUrl',
    },
    {
        antiPattern: 'bypassSecurityTrustResourceUrl',
        category: 'angular-bypassSecurityTrustResourceUrl',
    },
    {
        antiPattern: 'ElementRef',
        category: 'angular-ElementRef',
    },
    {
        antiPattern: 'Renderer2',
        category: 'angular-Renderer2',
    },

    {
        antiPattern: 'window',
        category: 'commons-window',
    },
    {
        antiPattern: '.innerHtml',
        category: 'commons-innerHtml',
    },
    {
        antiPattern: '.outerHtml',
        category: 'commons-outerHtml',
    },
    {
        antiPattern: '.writeln(',
        category: 'commons-writeln',
    },
    {
        antiPattern: '.write(',
        category: 'commons-write',
    },
    {
        antiPattern: '<script>',
        category: 'commons-script-element',
    },
    {
        antiPattern: '<iframe>',
        category: 'commons-iframe-element',
    },
    {
        antiPattern: '<object>',
        category: 'commons-object-element',
    },
    {
        antiPattern: '<embed>',
        category: 'commons-embed-element',
    },
    {
        antiPattern: 'alert(',
        category: 'commons-alert',
    },
    {
        antiPattern: 'console.',
        category: 'commons-console',
    },
    {
        antiPattern: 'javascript:',
        category: 'commons-javascript-link',
    },
    {
        antiPattern: 'href=',
        category: 'commons-href-link',
    },
    {
        antiPattern: 'src=',
        category: 'commons-src-link',
    },
    {
        antiPattern: 'localStorage',
        category: 'commons-localStorage',
    },
    {
        antiPattern: 'sessionStorage',
        category: 'commons-sessionStorage',
    },
    {
        antiPattern: 'cookie',
        category: 'commons-cookie',
    },
    {
        antiPattern: 'eval(',
        category: 'commons-eval-function',
    },
    {
        antiPattern: 'JSON.stringify',
        category: 'commons-stringify-function',
    },
];

export const codeSmellTypes = {
    Dependency: 'Dependency',
    Lighthouse: 'Lighthouse',
    'Code-Coupling': 'Code-Coupling',
    'Code-Duplication': 'Code-Duplication',
    'Code-Complexity': 'Code-Complexity',
    'Code-Security': 'Code-Security',
    'Code-Modularity': 'Code-Modularity',
};

export const codeSmellCategories = {
    deprecated: 'deprecated',
    outdated: 'outdated',
    seo: 'seo',
    accessibility: 'accessibility',
    performance: 'performance',
    'first-contentful-paint': 'first-contentful-paint',
    'largest-contentful-paint': 'largest-contentful-paint',
    'cumulative-layout-shift': 'cumulative-layout-shift',
    'total-blocking-time': 'total-blocking-time',
    'speed-index': 'speed-index',
    'circular-dependencies': 'circular-dependencies',
    'instability-index': 'instability-index',
    'efferent-coupling': 'efferent-coupling',
    'afferent-coupling': 'afferent-coupling',
    'maintainability-index': 'maintainability-index',
    'maintainability-index-project-average': 'maintainability-index-project-average',
    'cyclomatic-complexity': 'cyclomatic-complexity',
    'halstead-program-length': 'halstead-program-length',
    'halstead-program-volume': 'halstead-program-volume',
    'halstead-program-difficulty': 'halstead-program-difficulty',
    'halstead-program-effort': 'halstead-program-effort',
    'halstead-program-estimated-bugs': 'halstead-program-estimated-bugs',
    'halstead-program-time-to-implement': 'halstead-program-time-to-implement',
    'physical-sloc': 'physical-sloc',
    'logical-sloc': 'logical-sloc',
    'code-duplication-percent': 'code-duplication-percent',
    'code-duplication-total-duplicated-lines': 'code-duplication-total-duplicated-lines',
    'code-duplication-file': 'code-duplication-file',
    'interaction-density': 'interaction-density',
    'interaction-groups': 'interaction-groups',
    'independent-files-ratio': 'independent-files-ratio',
    'file-degree-centrality': 'file-degree-centrality',
    'file-in-degree-centrality': 'file-in-degree-centrality',
    'file-out-degree-centrality': 'file-out-degree-centrality',
    ...securityAntiPatterns.reduce((acc, { category }) => ({ ...acc, [category]: category }), {}),
};
