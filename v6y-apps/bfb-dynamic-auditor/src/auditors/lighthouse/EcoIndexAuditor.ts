import { AppLogger, ApplicationProvider, AuditProvider, LinkType } from '@v6y/core-logic';

import { LighthouseAuditConfigType } from '../types/LighthouseAuditType.ts';
import EcoIndexUtils from './EcoIndexUtils.ts';
import LighthouseAuditor from './LighthouseAuditor.ts';
import LighthouseConfig from './LighthouseConfig.ts';

const { LIGHTHOUSE_DEVICE_CONFIG } = LighthouseConfig;
const { startLighthouseAudit } = LighthouseAuditor;

/**
 * Starts the Ecoindex audit for a given application.
 * Runs Lighthouse to collect raw page metrics, then computes
 * the Ecoindex score independently of Lighthouse reporting.
 * @param applicationId
 * @param browserPath
 */
const startAuditorAnalysis = async ({ applicationId, browserPath }: LighthouseAuditConfigType) => {
    try {
        AppLogger.info(`[EcoIndexAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`);
        AppLogger.info(`[EcoIndexAuditor - startAuditorAnalysis] browserPath:  ${browserPath}`);

        if (applicationId === undefined) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        AppLogger.info(
            `[EcoIndexAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        const auditLinks = application?.links?.filter((link: LinkType) =>
            link?.label?.includes('production'),
        );

        AppLogger.info(
            `[EcoIndexAuditor - startAuditorAnalysis] auditLinks:  ${auditLinks?.length}`,
        );

        if (!auditLinks?.length) {
            return false;
        }

        const ecoindexReports = [];

        for (const auditLink of auditLinks) {
            AppLogger.info(
                `[EcoIndexAuditor - startAuditorAnalysis] auditLink:  ${auditLink?.value}`,
            );

            if (!auditLink?.value?.length) {
                continue;
            }

            const { value: linkValue } = auditLink;

            for (const device of Object.keys(LIGHTHOUSE_DEVICE_CONFIG)) {
                AppLogger.info(`[EcoIndexAuditor - startAuditorAnalysis] device:  ${device}`);

                const data = await startLighthouseAudit({
                    link: linkValue,
                    browserPath,
                    lightHouseConfig: LIGHTHOUSE_DEVICE_CONFIG[device],
                });

                // eslint-disable-next-line max-depth
                if (!data) {
                    continue;
                }

                const ecoindexEntry = EcoIndexUtils.computeEcoindexAuditEntry({
                    data,
                    subCategory: device,
                    appId: application._id,
                    webUrl: linkValue,
                });

                // eslint-disable-next-line max-depth
                if (ecoindexEntry) {
                    ecoindexReports.push(ecoindexEntry);
                }
            }
        }

        AppLogger.info(
            `[EcoIndexAuditor - startAuditorAnalysis] ecoindexReports:  ${ecoindexReports?.length}`,
        );

        await AuditProvider.insertAuditList(ecoindexReports);

        AppLogger.info(
            `[EcoIndexAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );

        return true;
    } catch (error) {
        AppLogger.error(
            '[EcoIndexAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const EcoIndexAuditor = {
    startAuditorAnalysis,
};

export default EcoIndexAuditor;
