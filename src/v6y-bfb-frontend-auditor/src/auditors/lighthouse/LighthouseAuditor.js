import { AppLogger, ApplicationProvider } from '@v6y/commons';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';

import LighthouseConfig from './LighthouseConfig.js';

const {
    LIGHTHOUSE_DEVICE_CONFIG,
    PUPPETEER_SETTINGS,
    PUPPETEER_PAGE_SETTINGS,
    LIGHTHOUSE_FLAGS,
    formatLighthouseReports,
    formatLighthouseKeywords,
    formatLighthouseEvolutions,
} = LighthouseConfig;

const startLighthouseAudit = async (auditConfig) => {
    try {
        // open browser
        const { link, user, browserPath, lightHouseConfig } = auditConfig || {};

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
            sessionStorage.setItem('sgSignIn', JSON.stringify(args));
        }, user);

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

const startAuditorAnalysis = async ({ applicationId, workspaceFolder, browserPath }) => {
    try {
        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(`[LighthouseAuditor - startAuditorAnalysis] browserPath:  ${browserPath}`);

        if (!applicationId?.length || !workspaceFolder?.length || !browserPath?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
        });

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const lightHouseReports = [];

        const auditLinks = application?.links;

        if (!auditLinks?.length) {
            return {};
        }

        for (const auditLink of auditLinks) {
            AppLogger.info(
                `[LightHouseAuditor - startAuditorAnalysis] auditLink:  ${auditLink?.link}`,
            );

            if (!auditLink?.link?.length) {
                continue;
            }

            const { link, user } = auditLink;

            for (const device of Object.keys(LIGHTHOUSE_DEVICE_CONFIG)) {
                AppLogger.info(`[LightHouseAuditor - startAuditorAnalysis] device:  ${device}`);

                const report = await startLighthouseAudit({
                    link,
                    user,
                    browserPath,
                    lightHouseConfig: LIGHTHOUSE_DEVICE_CONFIG[device],
                });

                if (!report) {
                    continue;
                }

                lightHouseReports.push({
                    appLink: link,
                    subCategory: device,
                    data: report,
                });
            }
        }

        AppLogger.info(
            `[LightHouseAuditor - startAuditorAnalysis] lightHouseReports:  ${lightHouseReports?.length}`,
        );

        const auditReports = formatLighthouseReports(lightHouseReports);

        AppLogger.info(
            `[LightHouseAuditor - startAuditorAnalysis] auditReports:  ${auditReports?.length}`,
        );

        const keywords = formatLighthouseKeywords(auditReports);

        AppLogger.info(`[LightHouseAuditor - startAuditorAnalysis] keywords:  ${keywords?.length}`);

        const evolutions = formatLighthouseEvolutions(keywords);

        AppLogger.info(
            `[LightHouseAuditor - startAuditorAnalysis] evolutions:  ${evolutions?.length}`,
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
