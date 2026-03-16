import axios from 'axios';

import { AppLogger, ApplicationType, AuditType, auditStatus, scoreStatus } from '@v6y/core-logic';

const GREEN_WEB_API_BASE = 'https://api.thegreenwebfoundation.org/api/v3/greencheck';

interface GreenWebApiResponse {
    green: boolean;
    url: string;
    hosted_by: string | null;
    hosted_by_website: string | null;
    supporting_documents: unknown[];
}

/**
 * Check if a given URL's hosting provider is powered by green energy
 * using The Green Web Foundation API
 * @param url - The production URL to check
 */
const checkGreenHosting = async (
    url: string,
): Promise<{ hostname: string; data: GreenWebApiResponse } | null> => {
    try {
        const { hostname } = new URL(url);
        AppLogger.info(`[GreenHostingUtils - checkGreenHosting] checking hostname: ${hostname}`);

        const response = await axios.get<GreenWebApiResponse>(`${GREEN_WEB_API_BASE}/${hostname}`, {
            timeout: 10_000,
        });

        return { hostname, data: response.data };
    } catch (error) {
        AppLogger.error(`[GreenHostingUtils - checkGreenHosting] error for ${url}: ${error}`);
        return null;
    }
};

/**
 * Format green hosting audit reports for a list of production URLs
 * @param application
 * @param links - List of production URLs to audit
 */
const formatGreenHostingReports = async ({
    application,
    links,
}: {
    application: ApplicationType;
    links: string[];
}): Promise<AuditType[]> => {
    try {
        AppLogger.info(
            `[GreenHostingUtils - formatGreenHostingReports] application: ${application?._id}`,
        );
        AppLogger.info(
            `[GreenHostingUtils - formatGreenHostingReports] links count: ${links?.length}`,
        );

        if (!application?._id || !links?.length) {
            return [];
        }

        const reports: AuditType[] = [];

        for (const url of links) {
            const result = await checkGreenHosting(url);
            if (!result) {
                continue;
            }

            const { hostname, data } = result;
            const { green, hosted_by, hosted_by_website } = data;

            reports.push({
                type: 'Green-Hosting',
                category: 'green-hosting',
                auditStatus: auditStatus.success,
                scoreStatus: green ? scoreStatus.success : scoreStatus.error,
                score: green ? 100 : 0,
                scoreUnit: '%',
                extraInfos: JSON.stringify({
                    url,
                    hostname,
                    green,
                    hostedBy: hosted_by ?? 'Unknown',
                    hostedByWebsite: hosted_by_website ?? null,
                }),
                module: {
                    appId: application._id,
                    url,
                    branch: undefined,
                    path: undefined,
                },
            });
        }

        AppLogger.info(
            `[GreenHostingUtils - formatGreenHostingReports] generated ${reports.length} reports`,
        );

        return reports;
    } catch (error) {
        AppLogger.error(`[GreenHostingUtils - formatGreenHostingReports] error: ${error}`);
        return [];
    }
};

const GreenHostingUtils = {
    formatGreenHostingReports,
};

export default GreenHostingUtils;
