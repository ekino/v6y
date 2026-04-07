import { createRequire } from 'node:module';

import { AppLogger, AuditType, Matcher, auditStatus, scoreStatus } from '@v6y/core-logic';

const {
    computeEcoIndex,
    computeGreenhouseGasesEmissionfromEcoIndex,
    computeWaterConsumptionfromEcoIndex,
    getEcoIndexGrade,
} = createRequire(import.meta.url)('ecoindex') as typeof import('ecoindex');

/**
 * Extract Ecoindex input metrics from raw Lighthouse JSON data.
 * Returns null if the required audits are not present.
 * @param auditReportData
 */
const extractEcoindexInputs = (
    auditReportData?: string | string[],
): { dom: number; requests: number; size: number } | null => {
    try {
        if (!auditReportData?.length) return null;
        const raw = Array.isArray(auditReportData) ? auditReportData[0] : auditReportData;
        const jsonData = JSON.parse(raw);
        const { audits } = jsonData || {};
        if (!audits) return null;

        const diagnostics = audits?.diagnostics?.details?.items?.[0];

        const dom =
            audits?.['dom-size']?.numericValue ??
            audits?.['dom-size-insight']?.numericValue ??
            audits?.['dom-size-insight']?.details?.debugData?.totalElements;

        const requests =
            audits?.['network-requests']?.numericValue ??
            audits?.['network-requests']?.details?.items?.length ??
            diagnostics?.numRequests;

        const sizeBytes =
            audits?.['total-byte-weight']?.numericValue ?? diagnostics?.totalByteWeight;

        if (dom == null || requests == null || sizeBytes == null) return null;

        return {
            dom: Math.round(dom),
            requests: Math.round(requests),
            size: Math.round(sizeBytes / 1024), // convert bytes to Kb
        };
    } catch (error) {
        AppLogger.info(`[EcoIndexUtils - extractEcoindexInputs] error: ${error}`);
        return null;
    }
};

/**
 * Compute a single Ecoindex AuditType entry from Lighthouse raw data.
 * Uses the GreenIT-Analysis reference algorithm (no external package).
 * @param data
 * @param subCategory - device (mobile/desktop)
 * @param appId
 * @param webUrl
 */
const computeEcoindexAuditEntry = ({
    data,
    subCategory,
    appId,
    webUrl,
}: {
    data?: string | string[];
    subCategory?: string;
    appId?: number;
    webUrl?: string;
}): AuditType | null => {
    try {
        const inputs = extractEcoindexInputs(data);
        if (!inputs) return null;

        const { dom, requests, size } = inputs;
        const score = computeEcoIndex(dom, requests, size);
        const grade = getEcoIndexGrade(score);
        const water = parseFloat(computeWaterConsumptionfromEcoIndex(score));
        const ghg = parseFloat(computeGreenhouseGasesEmissionfromEcoIndex(score));

        const ecoScoreStatus = Matcher()
            .on(
                () => grade <= 'B',
                () => scoreStatus.success,
            )
            .on(
                () => grade <= 'D',
                () => scoreStatus.warning,
            )
            .otherwise(() => scoreStatus.error);

        return {
            type: 'Ecoindex',
            category: 'ecoindex',
            subCategory,
            auditStatus: auditStatus.success,
            scoreStatus: ecoScoreStatus as string,
            score: parseFloat(score.toFixed(1)),
            scoreUnit: '/100',
            extraInfos: JSON.stringify({ grade, water, ghg, dom, requests, size }),
            module: {
                appId: appId as number,
                url: webUrl,
                path: webUrl,
                branch: undefined,
            },
        };
    } catch (error) {
        AppLogger.info(`[EcoIndexUtils - computeEcoindexAuditEntry] error: ${error}`);
        return null;
    }
};

const EcoIndexUtils = {
    extractEcoindexInputs,
    computeEcoindexAuditEntry,
};

export default EcoIndexUtils;
