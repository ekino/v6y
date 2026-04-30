import { AppLogger, AuditType, Matcher, auditStatus, scoreStatus } from '@v6y/core-logic';

// EcoIndex algorithm — MIT licence — https://github.com/cnumr/ecoindex_node
const DOM_QUANTILES = [
    0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801,
    2479, 594601,
];
const REQ_QUANTILES = [
    0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920,
];
const SIZE_QUANTILES = [
    0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27,
    1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26,
];

const quantileIndex = (quantiles: number[], value: number): number => {
    for (let i = 1; i < quantiles.length; i++) {
        if (value < quantiles[i]) {
            return i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]);
        }
    }
    return quantiles.length - 1;
};

const computeEcoIndex = (dom: number, req: number, size: number): number =>
    Math.round(
        100 -
            (5 *
                (3 * quantileIndex(DOM_QUANTILES, dom) +
                    2 * quantileIndex(REQ_QUANTILES, req) +
                    quantileIndex(SIZE_QUANTILES, size))) /
                6,
    );

const getEcoIndexGrade = (score: number): string => {
    if (score >= 75) return 'A';
    if (score >= 65) return 'B';
    if (score >= 50) return 'C';
    if (score >= 35) return 'D';
    if (score >= 20) return 'E';
    if (score >= 5) return 'F';
    return 'G';
};

const computeGreenhouseGasesEmissionfromEcoIndex = (score: number): string =>
    (Math.round(100 * (2 + (2 * (50 - score)) / 100)) / 100).toString();

const computeWaterConsumptionfromEcoIndex = (score: number): string =>
    (Math.round(100 * (3 + (3 * (50 - score)) / 100)) / 100).toString();

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
