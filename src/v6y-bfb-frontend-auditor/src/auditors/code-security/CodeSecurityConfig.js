import { Matcher } from '@v6y/commons';

const SECURITY_ANTI_PATTERNS_TOKENS = [
    'findDOMNode',
    'createFactory',
    'createElement',
    'cloneElement',
    'dangerouslySetInnerHTML',
    '.innerHtml',
    '.outerHtml',
    '.writeln(',
    '.write(',
    '<iframe>',
    'alert(',
    'console.',
    'javascript:',
    'localStorage',
    'sessionStorage',
    'cookie',
    'eval(',
];

/**
 * Format helpful commons links
 * @returns {Object}
 */
const formatCommonsDocLinks = () => [
    {
        type: 'doc',
        label: 'OWASP Checklist',
        value: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#html-sanitization',
    },
    {
        type: 'doc',
        label: 'OWASP Top 10 Web Application Security Risks',
        value: 'https://owasp.org/www-project-top-ten/',
    },
    {
        type: 'doc',
        label: 'CWE Top 25 Most Dangerous Software Weaknesses',
        value: 'https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html',
    },
];

/**
 * This function formats documentation links based on the anti-pattern provided.
 * @param {string} antiPattern - The anti-pattern for which the documentation links are to be formatted.
 */
const formatDocLinks = (antiPattern) =>
    Matcher()
        .on(
            () => antiPattern === 'findDOMNode',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://react.dev/reference/react-dom/findDOMNode',
                },
            ],
        )
        .on(
            () => antiPattern === 'createFactory',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://react.dev/reference/react/createFactory',
                },
            ],
        )
        .on(
            () => antiPattern === 'dangerouslySetInnerHTML',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'DOMPurify',
                    value: 'https://www.npmjs.com/package/dompurify',
                },
                {
                    type: 'doc',
                    label: 'OWASP Cross Site Scripting Prevention',
                    value: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
                },
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html',
                },
            ],
        )
        .on(
            () => antiPattern === 'iframe',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://owasp.org/www-community/attacks/Cross_Frame_Scripting',
                },
            ],
        )
        .on(
            () => antiPattern === 'alert',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html',
                },
            ],
        )
        .on(
            () => antiPattern === 'console',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html#perform-application-activity-logging',
                },
            ],
        )
        .on(
            () =>
                antiPattern === 'cookie' ||
                antiPattern === 'sessionStorage' ||
                antiPattern === 'localStorage',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'Session hijacking',
                    value: 'https://developer.mozilla.org/fr/docs/Glossary/Session_Hijacking',
                },
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://fr.wikipedia.org/wiki/Hijacking',
                },
            ],
        )
        .on(
            () => antiPattern === 'eval',
            () => [
                ...formatCommonsDocLinks(),
                {
                    type: 'doc',
                    label: 'eval()',
                    value: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/eval#nutiliser_eval_quen_dernier_recours_!',
                },
                {
                    type: 'doc',
                    label: 'expression()',
                    value: 'https://www.zonecss.fr/proprietes-css/expression-css-fonction.html#:~:text=D%C3%A9finition%20de%20la%20CSS%20expression,%3B%20width%20%3A%20expression(%20document.',
                },
                {
                    type: 'doc',
                    label: 'More information',
                    value: 'https://cwe.mitre.org/data/definitions/95.html',
                },
            ],
        )
        .otherwise(() => [...formatCommonsDocLinks()]);

/**
 * This function formats the evolution of security audit based on the anti-pattern.
 *
 * @param {string} antiPattern - The anti-pattern to be checked.
 * @returns {Object|null} - An object containing the type, branch, title, description, and docLinks for the keyword. If the anti-pattern does not match any condition, it returns null.
 *
 * @example
 *
 * const params = {
 *   antiPattern: 'dangerouslySetInnerHTML',
 *   auditBranch: 'main'
 * };
 *
 * const evolution = formatRecommendation(params);
 * // Output:
 * // {
 * //   type: 'frontend',
 * //   branch: 'main',
 * //   title: 'The use of the React capability dangerouslySetInnerHTML must be with caution.',
 * //   description: '...',
 * //   docLinks: '...',
 * // }
 */
const formatRecommendation = (antiPattern) =>
    Matcher()
        .on(
            () =>
                antiPattern === 'findDOMNode' ||
                antiPattern === 'createElement' ||
                antiPattern === 'createFactory' ||
                antiPattern === 'cloneElement',
            () => ({
                type: 'frontend',
                title: `Replace ${antiPattern} with a regular React component.`,
                description: `
- The APIs findDOMNode and createFactory are deprecated and will be removed in the next major version of React.<br />
- The use of these React capabilities is not recommended for security and performance reasons: findDOMNode, createElement, createFactory, and cloneElement.<br />
- Imperative access and manipulation of HTML elements (DOM) are not recommended in React for performance and security reasons.<br />
- React is a declarative API, the DOM lifecycle (insertion, deletion, update, ...) must be fully managed by React.<br />
      `,
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () =>
                antiPattern === 'innerHtml' ||
                antiPattern === 'outerHtml' ||
                antiPattern === 'write' ||
                antiPattern === 'writeln',
            () => ({
                type: 'frontend',
                title: `Replace or sanitize ${antiPattern}.`,
                description: `
- The HTML APIs such as innerHtml, outerHtml, write, and writeln are often the culprits behind DOM-based Cross-Site Scripting (XSS) attacks. These attacks occur when these APIs are fed with untrusted inputs, leading to potential XSS vulnerabilities.<br />
- To mitigate this risk, it’s recommended to avoid using innerHtml. Instead, safer alternatives like innerText or textContent should be used as they do not interpret the passed content as HTML, but instead insert it as raw text. This helps prevent the execution of malicious scripts.<br />
- Remember, always validate and sanitize inputs to prevent security vulnerabilities. It’s a good practice to follow the principle of least privilege, only allowing necessary actions to be performed to minimize potential damage.<br />
`,
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () => antiPattern === 'dangerouslySetInnerHTML',
            () => ({
                type: 'frontend',
                title: `The use of the React capability ${antiPattern} must be with caution.`,
                description: `
- The html string given to dangerouslySetInnerHTML must be necessarily purified using DOMPurify (DOMPurify.sanitize(htmlData)).<br />
- The use of dangerouslySetInnerHTML must be minimal and limited to data received from the backend to avoid security issues.<br />
- The use of JSON.stringify with dangerouslySetInnerHTML must be with caution (dynamic injection vulnerability).<br />
    `,
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () => antiPattern === 'iframe',
            () => ({
                type: 'frontend',
                title: `The use of ${antiPattern} must be with caution.`,
                description:
                    'iFrames, while useful, pose security risks such as Cross-Site Scripting (XSS) attacks, iFrame injection, iFrame phishing, Cross-Frame Scripting (XFS), and clickjacking, which can lead to data theft, malware installation, and redirection to malicious sites.',
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () => antiPattern === 'alert',
            () => ({
                type: 'frontend',
                title: 'alert(...) should not be used.',
                description:
                    'alert(...) as well as confirm(...) and prompt(...) can be useful for debugging during development, but in production mode this kind of pop-up could expose sensitive information to attackers, and should never be displayed.',
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () => antiPattern === 'console',
            () => ({
                type: 'frontend',
                title: 'console should not be used.',
                description:
                    'It is not recommended to leave or store sensitive data (even mocks) in the Frontend or to log sensitive data in the console.',
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () => antiPattern === 'javascript',
            () => ({
                type: 'frontend',
                title: `The use of urls (href or src) with "${antiPattern}:" is not recommended.`,
                description:
                    'The use of javascript: or data: is not recommended for security reasons. Example: <a href="javascript: alert(1)">.',
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () =>
                antiPattern === 'cookie' ||
                antiPattern === 'sessionStorage' ||
                antiPattern === 'localStorage',
            () => ({
                type: 'frontend',
                title: `The use of ${antiPattern} must be with caution.`,
                description:
                    'Cookies, sessionStorage, and localStorage, while useful for storing data on the client side, are susceptible to security risks such as session hijacking, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and potential data theft or tampering.',
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .on(
            () => antiPattern === 'eval',
            () => ({
                type: 'frontend',
                title: `The use of "${antiPattern}" is not recommended.`,
                description: `
- eval() is a dangerous function that executes the code passed as an argument with the privileges of the calling environment.
If eval() is used with a maliciously constructed string, it could result in the execution of malicious code on the user's machine with the permissions given to the site or add-on.
At an even more critical level, third-party code could thus consult the scope in which eval() was invoked. This could allow attacks that would not have been made possible using a Function object.<br />

- eval() is also slower than alternative methods.
Indeed, evaluation requires calling the JavaScript interpreter while many structures are optimized by modern JavaScript engines.<br />

- The equivalent of eval() in css is expression(). Similarly, the use of expression() is not recommended in css.
The CSS pseudo property expression() allows to insert Javascript in the CSS sheet.<br />
    `,
                docLinks: formatDocLinks(antiPattern),
            }),
        )
        .otherwise(() => null);

/**
 * This function formats the security audit report based on the anti-pattern.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.fileName - The name of the file being audited.
 * @param {string} params.antiPattern - The anti-pattern to be checked.
 *
 * @returns {Object} - An object containing the formatted security audit report item for the given anti-pattern.
 *
 * @example
 *
 * const params = {
 *   fileName: '/src/App.js',
 *   antiPattern: 'dangerouslySetInnerHTML',
 *   auditBranch: 'main',
 * };
 *
 * const report = formatSecurityAuditReport(params);
 * // Output:
 * // {
 * //   type: 'frontend',
 * //   branch: 'main',
 * //   title: 'The use of the React capability dangerouslySetInnerHTML must be with caution.',
 * //   description: '',
 * //   docLinks: '...',
 * //   ...
 * // }
 */
const formatSecurityAuditReport = ({ fileName, antiPattern }) =>
    ({
        findDOMNode: {
            file: fileName,
            antiPattern: 'findDOMNode',
            title: `The use of the React capability ${antiPattern} is not recommended.`,
            recommendation: formatRecommendation('findDOMNode'),
        },
        createFactory: {
            file: fileName,
            antiPattern: 'createFactory',
            title: `The use of the React capability ${antiPattern} is not recommended.`,
            recommendation: formatRecommendation('createFactory'),
        },
        createElement: {
            file: fileName,
            antiPattern: 'createElement',
            title: `The use of the React capability ${antiPattern} is not recommended.`,
            recommendation: formatRecommendation('createElement'),
        },
        cloneElement: {
            file: fileName,
            antiPattern: 'cloneElement',
            title: `The use of the React capability ${antiPattern} is not recommended.`,
            recommendation: formatRecommendation('cloneElement'),
        },
        dangerouslySetInnerHTML: {
            file: fileName,
            antiPattern: 'dangerouslySetInnerHTML',
            title: `The use of the React capability ${antiPattern} must be with caution.`,
            recommendation: formatRecommendation('dangerouslySetInnerHTML'),
        },
        '.innerHtml': {
            file: fileName,
            antiPattern: 'innerHtml',
            title: 'The use of the HTML API "innerHtml" must be with caution.',
            recommendation: formatRecommendation('innerHtml'),
        },
        '.outerHtml': {
            file: fileName,
            antiPattern: 'outerHtml',
            title: 'The use of the HTML API "outerHtml" must be with caution.',
            recommendation: formatRecommendation('outerHtml'),
        },
        '.writeln(': {
            file: fileName,
            antiPattern: 'writeln',
            title: 'The use of the HTML API "writeln" must be with caution.',
            recommendation: formatRecommendation('writeln'),
        },
        '.write(': {
            file: fileName,
            antiPattern: 'write',
            title: 'The use of the HTML API "write" must be with caution.',
            recommendation: formatRecommendation('write'),
        },
        '<iframe>': {
            file: fileName,
            antiPattern: 'iframe',
            title: 'The use of the HTML tag "iframe" must be with caution.',
            recommendation: formatRecommendation('iframe'),
        },
        'javascript:': {
            file: fileName,
            antiPattern: 'javascript',
            title: 'The use of urls (href or src) with "javascript:" is not recommended.',
            recommendation: formatRecommendation('javascript'),
        },
        'alert(': {
            file: fileName,
            antiPattern: 'alert',
            title: 'The use of the JavaScript API "alert" is not recommended in PROD.',
            recommendation: formatRecommendation('alert'),
        },
        'console.': {
            file: fileName,
            antiPattern: 'console',
            title: 'The use of the JavaScript API "console" is not recommended in PROD.',
            recommendation: formatRecommendation('console'),
        },
        localStorage: {
            file: fileName,
            antiPattern: 'localStorage',
            title: `The use of "${antiPattern}" must be with caution.`,
            recommendation: formatRecommendation('localStorage'),
        },
        sessionStorage: {
            file: fileName,
            antiPattern: 'sessionStorage',
            title: `The use of "${antiPattern}" must be with caution.`,
            recommendation: formatRecommendation('sessionStorage'),
        },
        cookie: {
            file: fileName,
            antiPattern: 'cookie',
            title: `The use of "${antiPattern}" must be with caution.`,
            recommendation: formatRecommendation('cookie'),
        },
        'eval(': {
            file: fileName,
            antiPattern: 'eval',
            title: 'The use of "eval" is not recommended.',
            recommendation: formatRecommendation('eval'),
        },
    })[antiPattern];

const CodeSecurityConfig = {
    SECURITY_ANTI_PATTERNS_TOKENS,
    formatSecurityAuditReport,
};

export default CodeSecurityConfig;
