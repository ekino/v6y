import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';

import LighthouseConfig from './LighthouseConfig.js';
import LighthouseUtils from './LighthouseUtils.js';

const { LIGHTHOUSE_DEVICE_CONFIG, PUPPETEER_SETTINGS, PUPPETEER_PAGE_SETTINGS, LIGHTHOUSE_FLAGS } =
    LighthouseConfig;

const { formatLighthouseReports } = LighthouseUtils;

/**
 * Starts a Lighthouse audit for a given configuration.
 *
 * @param {Object} auditConfig - The configuration for the audit.
 * @param {string} auditConfig.link - The URL to audit.
 * @param {string} auditConfig.browserPath - The path to the browser executable.
 * @param {Object} auditConfig.lightHouseConfig - The Lighthouse configuration.
 * @returns {Promise<string|null>} - The Lighthouse report or null if an error occurs.
 */
const startLighthouseAudit = async (auditConfig) => {
    try {
        // open browser
        const { link, browserPath, lightHouseConfig } = auditConfig || {};

        const browser = await puppeteer.launch({
            ...PUPPETEER_SETTINGS,
            executablePath: browserPath,
        });
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] browser opened`);

        // open new page
        const page = await browser.newPage();
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] page opened`);

        // open url
        await page.goto(link, {
            ...PUPPETEER_PAGE_SETTINGS,
        });
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] navigation to ${link}`);

        // reset scroll & customize cookies
        await page.evaluate((args) => {
            window.scroll(0, 0);
            // sessionStorage.setItem('user', JSON.stringify(args));
        }, {});

        AppLogger.info(
            `[LightHouseAuditor - startLighthouseAudit] reset page scroll & customize cookies if needed`,
        );

        // Lighthouse will open the URL.
        const result = await lighthouse(link, LIGHTHOUSE_FLAGS, lightHouseConfig, page);
        const report = result?.report;
        AppLogger.info(
            `[LightHouseAuditor - startLighthouseAudit] lighthouse report: ${Object.keys(result || {}).join(', ')}`,
        );

        // close browser
        await browser.close();
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] browser closed`);

        // lighthouse json report
        return report;
    } catch (error) {
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] error:  ${error.message}`);
        return null;
    }
};

/**
 * Starts the auditor analysis for a given application and workspace folder.
 *
 * @param {Object} params - The parameters for the auditor analysis.
 * @param {string} params.applicationId - The ID of the application.
 * @param {string} params.browserPath - The path to the browser executable.
 * @returns {Promise<boolean>} - Returns true if the analysis is successful, otherwise false.
 */
const startAuditorAnalysis = async ({ applicationId, browserPath }) => {
    try {
        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(`[LighthouseAuditor - startAuditorAnalysis] browserPath:  ${browserPath}`);

        if (applicationId === undefined) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            appId: applicationId,
        });
        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const lightHouseReports = [];

        const auditLinks = application?.links?.filter((link) =>
            link?.label?.includes('production'),
        );
        AppLogger.info(
            `[LightHouseAuditor - startAuditorAnalysis] auditLinks:  ${auditLinks?.length}`,
        );

        if (!auditLinks?.length) {
            return false;
        }

        for (const auditLink of auditLinks) {
            AppLogger.info(
                `[LightHouseAuditor - startAuditorAnalysis] auditLink:  ${auditLink?.value}`,
            );

            if (!auditLink?.value?.length) {
                continue;
            }

            const { value: linkValue } = auditLink;

            for (const device of Object.keys(LIGHTHOUSE_DEVICE_CONFIG)) {
                AppLogger.info(`[LightHouseAuditor - startAuditorAnalysis] device:  ${device}`);

                const report = await startLighthouseAudit({
                    link: linkValue,
                    browserPath,
                    lightHouseConfig: LIGHTHOUSE_DEVICE_CONFIG[device],
                });

                if (!report) {
                    continue;
                }

                lightHouseReports.push({
                    appLink: linkValue,
                    subCategory: device,
                    data: report,
                });
            }
        }

        AppLogger.info(
            `[LightHouseAuditor - startAuditorAnalysis] lightHouseReports:  ${lightHouseReports?.length}`,
        );

        const auditReports = formatLighthouseReports({
            reports: lightHouseReports,
            application,
        });

        AppLogger.info(
            `[LightHouseAuditor - startAuditorAnalysis] auditReports:  ${auditReports?.length}`,
        );

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );

        return true;
    } catch (error) {
        AppLogger.error(
            '[LighthouseAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const LighthouseAuditor = {
    startAuditorAnalysis,
};

export default LighthouseAuditor;
