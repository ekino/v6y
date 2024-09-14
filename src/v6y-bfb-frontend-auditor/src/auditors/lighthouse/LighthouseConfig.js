import { AppLogger } from '@v6y/commons';

import LighthouseUtils from './LighthouseUtils.js';

const { isAuditPerformanceFailed, isAuditAccessibilityFailed, parseLighthouseAuditReport } =
    LighthouseUtils;

// More Options : https://github.com/GoogleChrome/chrome-launcher
const PUPPETEER_SETTINGS = {
    // path must point to .exe : https://stackoverflow.com/questions/59786319/configure-puppeteer-executablepath-chrome-in-your-local-windows
    devtools: false,
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
        // https://github.com/GoogleChrome/chrome-launcher/blob/main/src/flags.ts
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-translate',
        '--force-device-scale-factor',
        '--ignore-certificate-errors',
        '--no-sandbox',
    ],
};

const PUPPETEER_PAGE_SETTINGS = {
    waitUntil: 'load',
    timeout: 1000000000,
    fullPage: true,
};

const LIGHTHOUSE_FLAGS = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility'],
};

const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75;
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9;
const MOTOG4_USERAGENT =
    'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36';
const DESKTOP_USERAGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

const LIGHTHOUSE_DESKTOP_CONFIG = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'desktop',
        throttling: {
            rttMs: 40,
            throughputKbps: 10 * 1024,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0, // 0 means unset
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0,
        },
        screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
        },
        emulatedUserAgent: DESKTOP_USERAGENT,
    },
};

const LIGHTHOUSE_MOBILE_SLOW_4G_CONFIG = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'mobile',
        throttling: {
            rttMs: 150,
            throughputKbps: 1.6 * 1024,
            requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
            downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
            mobile: true,
            width: 412,
            height: 823,
            // This value has some interesting ramifications for image-size-responsive, see:
            // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
            deviceScaleFactor: 1.75,
            disabled: false,
        },
        emulatedUserAgent: MOTOG4_USERAGENT,
    },
};

const LIGHTHOUSE_MOBILE_REGULAR_3G_CONFIG = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'mobile',
        throttling: {
            rttMs: 300,
            throughputKbps: 700,
            requestLatencyMs: 300 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
            downloadThroughputKbps: 700 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            uploadThroughputKbps: 700 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
            cpuSlowdownMultiplier: 4,
        },
        screenEmulation: {
            mobile: true,
            width: 412,
            height: 823,
            // This value has some interesting ramifications for image-size-responsive, see:
            // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
            deviceScaleFactor: 1.75,
            disabled: false,
        },
        emulatedUserAgent: MOTOG4_USERAGENT,
    },
};

// https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js
const LIGHTHOUSE_DEVICE_CONFIG = {
    desktop: LIGHTHOUSE_DESKTOP_CONFIG,
    'mobile-slow-4G': LIGHTHOUSE_MOBILE_SLOW_4G_CONFIG,
    'mobile-regular-3G': LIGHTHOUSE_MOBILE_REGULAR_3G_CONFIG,
};

const formatLighthouseKeywords = (auditReports) => {
    try {
        let emptyAuditReportsKeyword = null;
        if (!auditReports || !auditReports?.length) {
            AppLogger.info(`[formatLighthouseKeywords] empty audit report`);
            emptyAuditReportsKeyword = {
                label: "Aucun rapport d'audit lighthouse",
                type: 'frontend',
                color: 'error',
                level: 'FAILED',
                helpMessage: `L'application ne possède aucun rapport d'Audit LightHouse, ce qui constitue un risque pour la qualité de code et des livrables.`,
            };
        }

        // lighthouse: performance issue
        let performanceIssueKeyword = null;
        const hasPerformanceIssue = auditReports?.some?.(isAuditPerformanceFailed);
        AppLogger.info(`[formatLighthouseKeywords] hasPerformanceIssue : ${hasPerformanceIssue}`);
        if (hasPerformanceIssue) {
            performanceIssueKeyword = {
                label: `Lighthouse - Problème de performance`,
                type: 'frontend',
                color: 'error',
                level: 'FAILED',
                helpMessage: `Ce métrique indique un problème de performance suite à l'audit réalisée avec Lighthouse`,
            };
        }

        // lighthouse: accessibilité issue
        let accessibilityIssueKeyword = null;
        const hasAccessibilityIssue = auditReports?.some?.(isAuditAccessibilityFailed);
        AppLogger.info(
            `[formatLighthouseKeywords] hasAccessibilityIssue : ${hasAccessibilityIssue}`,
        );
        if (hasAccessibilityIssue) {
            accessibilityIssueKeyword = {
                label: `Lighthouse - Problème d\'accessibilité`,
                type: 'frontend',
                color: 'error',
                level: 'FAILED',
                helpMessage: `Ce métrique indique un problème d\'accessibilité suite à l'audit réalisée avec Lighthouse`,
            };
        }

        const lighthouseKeywords = [
            emptyAuditReportsKeyword,
            performanceIssueKeyword,
            accessibilityIssueKeyword,
        ].filter((item) => item);

        AppLogger.info(
            `[formatLighthouseKeywords] lighthouseKeywords : ${lighthouseKeywords?.length}`,
        );

        return lighthouseKeywords;
    } catch (error) {
        AppLogger.info(`[formatLighthouseKeywords] error : ${error.message}`);
        return [];
    }
};

const formatLighthouseEvolutions = (keywords) => {
    try {
        const lighthouseEvolutions = [];

        const hasPerformanceIssue = keywords?.some(
            (item) =>
                item.label?.toLowerCase()?.includes('lighthouse') &&
                item.label?.toLowerCase()?.includes('performance') &&
                item.color === 'error',
        );
        AppLogger.info(`[formatLighthouseEvolutions] hasPerformanceIssue : ${hasPerformanceIssue}`);
        if (hasPerformanceIssue) {
            lighthouseEvolutions.push({
                type: 'frontend',
                title: 'Audit Lighthouse - Conformité aux normes recommandées de performances',
                description: `
Dans cet audit, Lighthouse mesure la rapidité de chargement d'une page web et la rapidité avec laquelle les utilisateurs peuvent y accéder.

Avec la version 10 de Lighthouse, 4 indicateurs sont retenus pour mesurer la vitesse de chargement, avec chacun un poids différent :

- Le Largest Contentful Paint (LCP): évalue la vitesse d'affichage du plus grand élément sur une page web (25% du score Lighthouse).
- Le Cumulative Layout Shift (CLS): évalue la stabilité visuelle d'une page web (25% du score Lighthouse).
- Le Total Blocking Time (TBT): cumule les périodes pendant lesquelles une page ne peut pas répondre aux interactions, en se basant sur l'observation des Long Tasks (qui ont besoin de plus de 50 ms pour être exécutées) dans le Main Thread (30% du score Lighthouse).
- Le First Contentful Paint (FCP): indique le moment où le premier élément défini dans le DOM est rendu par le navigateur (10% du score Lighthouse).
- Le Speed Index: évalue la vitesse de chargement des éléments dans le viewport (10% du score Lighthouse).

Selon les données de Google, les sites web les plus performants on un temps de chargement d'environ 1.220 ms. Ce temps correspond alors à un score de 99.

Les scores des métriques et le score de perf sont colorés selon ces plages:

- 0 à 49 (rouge) : Médiocre
- 50 à 69 (orange) : A améliorer
- 70 à 100 (vert) : Bon

Pour offrir une bonne expérience utilisateur, le site doit avoir un bon score (90-100).
        `,
                docLinks: [
                    {
                        type: 'doc',
                        label: "Comment améliorer les performances d'une AWT-React ?",
                        value: 'https://xblocks.socgen/#/client/awt-react-optimisation-webpack.md',
                    },
                    {
                        type: 'doc',
                        label: 'Comment vérifier la "santé" d\'une AWT React ?',
                        value: 'https://xblocks.socgen/#/client/awt-react-project-sante.md',
                    },
                    {
                        type: 'doc',
                        label: 'Lighthouse Scoring Calculator',
                        value: 'https://googlechrome.github.io/lighthouse/scorecalc/',
                    },
                    {
                        type: 'doc',
                        label: "Plus d'informations",
                        value: 'https://developer.chrome.com/docs/lighthouse/performance/',
                    },
                ],
            });
        }

        const hasAccessibilityIssue = keywords?.some(
            (item) =>
                item.label?.toLowerCase()?.includes('lighthouse') &&
                item.label?.toLowerCase()?.includes('accessibilité') &&
                item.color === 'error',
        );
        AppLogger.info(
            `[formatLighthouseEvolutions] hasAccessibilityIssue : ${hasAccessibilityIssue}`,
        );
        if (hasAccessibilityIssue) {
            lighthouseEvolutions.push({
                type: 'frontend',
                title: "Audit Lighthouse - Conformité aux normes recommandées d'accessibilité",
                description: `
Lighthouse évalue la conformité avec les bonnes pratiques pour l'accessibilité web telles que : l'usage d'ARIA, l'importance des contrastes sur la page testée, la présence des balises alt sur les images et d'une version accessible des boutons… 
Soit des éléments qui permettent à des internautes malvoyants ou non voyants de naviguer, à l'aide d'outils de synthèse vocale le cas échéant. 

NB: Il s'agit d'une sélection de critères, ces vérifications n'ont pas vocation à remplacer les tests manuels.

Chaque audit d'accessibilité est une réussite ou un échec. Contrairement aux audits de performance, une page n'obtient pas de points pour avoir réussi partiellement un audit d'accessibilité.
Par exemple, si certains boutons d'une page ont des noms accessibles, mais pas d'autres, la page obtient un 0.
        `,
                docLinks: [
                    {
                        type: 'doc',
                        label: 'Comment vérifier que ma vue React est sémantiquement correcte ?',
                        value: 'https://xblocks.socgen/#/client/awt-react-semantique-a11y.md',
                    },
                    {
                        type: 'doc',
                        label: 'Comment vérifier que ma vue React est conforme A11y ?',
                        value: 'https://xblocks.socgen/#/client/awt-react-semantique-a11y.md',
                    },
                    {
                        type: 'doc',
                        label: "Plus d'informations",
                        value: 'https://developer.chrome.com/docs/lighthouse/accessibility/scoring/',
                    },
                ],
            });
        }

        AppLogger.info(
            `[formatLighthouseEvolutions] lighthouseEvolutions : ${lighthouseEvolutions?.length}`,
        );

        return lighthouseEvolutions;
    } catch (error) {
        AppLogger.info(`[formatLighthouseEvolutions] error : ${error.message}`);
        return [];
    }
};

const formatLighthouseReports = (reports) => {
    try {
        if (!reports?.length) {
            return null;
        }

        const auditReports = [];

        for (const report of reports) {
            const { appLink: webUrl, data, subCategory } = report || {};

            const results = parseLighthouseAuditReport(data);

            if (!results?.length) {
                continue;
            }

            for (const result of results) {
                auditReports.push({
                    ...result,
                    type: 'lighthouse',
                    subCategory,
                    webUrl,
                });
            }
        }

        AppLogger.info(`[LighthouseConfig - buildReports] auditReports:  ${auditReports?.length}`);

        return auditReports;
    } catch (error) {
        AppLogger.info(`[LighthouseConfig - buildReports] error:  ${error.message}`);
        return null;
    }
};

const LighthouseConfig = {
    PUPPETEER_SETTINGS,
    PUPPETEER_PAGE_SETTINGS,
    LIGHTHOUSE_FLAGS,
    LIGHTHOUSE_DEVICE_CONFIG,
    formatLighthouseReports,
    formatLighthouseKeywords,
    formatLighthouseEvolutions,
};

export default LighthouseConfig;
