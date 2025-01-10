import { AppLogger, ApplicationProvider, AuditProvider, LinkType } from '@v6y/core-logic';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer-core';

import { LighthouseAuditConfigType } from '../types/LighthouseAuditType.ts';
import LighthouseConfig from './LighthouseConfig.ts';
import LighthouseUtils from './LighthouseUtils.ts';

const { LIGHTHOUSE_DEVICE_CONFIG, PUPPETEER_SETTINGS, PUPPETEER_PAGE_SETTINGS, LIGHTHOUSE_FLAGS } =
    LighthouseConfig;

const { formatLighthouseReports } = LighthouseUtils;

/**
 * Starts the Lighthouse audit for a given link.
 * @param auditConfig
 */
const startLighthouseAudit = async (auditConfig: LighthouseAuditConfigType) => {
    try {
        // open browser
        const { link, browserPath, lightHouseConfig } = auditConfig || {};
        if (!link || !browserPath || !lightHouseConfig) {
            return null;
        }

        const browser = await puppeteer.launch({
            ...PUPPETEER_SETTINGS,
            executablePath: browserPath,
        });
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] browser opened`);

        // open new page
        const page = await browser.newPage();
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] page opened`);

        // open url
        await page.goto(link, PUPPETEER_PAGE_SETTINGS);
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] navigation to ${link}`);

        // reset scroll & customize cookies
        await page.evaluate(() => {
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
            `[LightHouseAuditor - startLighthouseAudit] lighthouse report: ${Object.keys(
                result || {},
            ).join(', ')}`,
        );

        // close browser
        await browser.close();
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] browser closed`);

        // lighthouse json report
        return report;
    } catch (error) {
        AppLogger.info(`[LightHouseAuditor - startLighthouseAudit] error:  ${error}`);
        return null;
    }
};

/**
 * Starts the Lighthouse audit for a given application.
 * @param applicationId
 * @param browserPath
 */
const startAuditorAnalysis = async ({ applicationId, browserPath }: LighthouseAuditConfigType) => {
    try {
        AppLogger.info(
            `[LighthouseAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(`[LighthouseAuditor - startAuditorAnalysis] browserPath:  ${browserPath}`);

        if (applicationId === undefined) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
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

        const auditLinks = application?.links?.filter((link: LinkType) =>
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

                // eslint-disable-next-line max-depth
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
