import { AppLogger, ApplicationProvider, AuditProvider, LinkType } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import GreenHostingUtils from './GreenHostingUtils.ts';

const { formatGreenHostingReports } = GreenHostingUtils;

/**
 * Start green hosting audit for a given application.
 * Iterates over production links and checks them against
 * The Green Web Foundation API.
 * @param applicationId
 */
const startAuditorAnalysis = async ({ applicationId }: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[GreenHostingAuditor - startAuditorAnalysis] applicationId: ${applicationId}`,
        );

        if (applicationId === undefined) {
            AppLogger.warn(
                `[GreenHostingAuditor - startAuditorAnalysis] Missing applicationId, skipping`,
            );
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        AppLogger.info(
            `[GreenHostingAuditor - startAuditorAnalysis] application _id: ${application?._id}`,
        );

        if (!application?._id) {
            AppLogger.warn(
                `[GreenHostingAuditor - startAuditorAnalysis] Application not found: ${applicationId}`,
            );
            return false;
        }

        const productionLinks = (application?.links || [])
            .filter((link: LinkType) => link?.label?.includes('production'))
            .map((link: LinkType) => link?.value)
            .filter((value: string | undefined): value is string => Boolean(value));

        AppLogger.info(
            `[GreenHostingAuditor - startAuditorAnalysis] productionLinks: ${productionLinks.length}`,
        );

        if (!productionLinks.length) {
            AppLogger.warn(
                `[GreenHostingAuditor - startAuditorAnalysis] No production links found`,
            );
            return false;
        }

        const greenHostingReports = await formatGreenHostingReports({
            application,
            links: productionLinks,
        });

        AppLogger.info(
            `[GreenHostingAuditor - startAuditorAnalysis] generated ${greenHostingReports.length} reports`,
        );

        if (!greenHostingReports.length) {
            return true;
        }

        await AuditProvider.insertAuditList(greenHostingReports);

        AppLogger.info(
            `[GreenHostingAuditor - startAuditorAnalysis] reports inserted successfully`,
        );

        return true;
    } catch (error) {
        AppLogger.error(
            `[GreenHostingAuditor - startAuditorAnalysis] An exception occurred: ${error}`,
        );
        return false;
    }
};

const GreenHostingAuditor = {
    startAuditorAnalysis,
};

export default GreenHostingAuditor;
