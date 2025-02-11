export interface SecurityAntiPattern {
    antiPattern: string;
    category: string;
}

export const securityAntiPatterns: SecurityAntiPattern[] = [
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
