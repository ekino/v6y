/**
 * EcoIndex computation utilities.
 *
 * Algorithm from the GreenIT-Analysis browser extension:
 * https://github.com/cnumr/GreenIT-Analysis/blob/master/script/ecoIndex.js
 *
 * Licensed under GNU Affero General Public License v3.0
 * Original work © didierfred@gmail.com
 *
 * Inputs
 *  dom      – number of DOM nodes
 *  requests – number of HTTP requests
 *  size     – total page weight in **KB**
 */

// Quantile reference tables derived from a panel of 200 000 web pages
const QUANTILES_DOM = [
    0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801,
    2479, 594601,
] as const;

const QUANTILES_REQUESTS = [
    0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920,
] as const;

const QUANTILES_SIZE = [
    0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27,
    1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26,
] as const;

/**
 * Interpolated quantile position for a value within a reference table.
 */
const computeQuantile = (quantiles: readonly number[], value: number): number => {
    for (let i = 1; i < quantiles.length; i++) {
        if (value < quantiles[i]) {
            return i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]);
        }
    }
    return quantiles.length - 1;
};

/**
 * Compute EcoIndex score (0–100, higher = greener).
 * @param dom       Number of DOM elements
 * @param requests  Number of network requests
 * @param size      Total page weight in KB
 */
export const computeEcoIndex = (dom: number, requests: number, size: number): number => {
    const qDom = computeQuantile(QUANTILES_DOM, dom);
    const qReq = computeQuantile(QUANTILES_REQUESTS, requests);
    const qSize = computeQuantile(QUANTILES_SIZE, size);
    const score = 100 - 5 * ((3 * qDom + 2 * qReq + qSize) / 6);
    return Math.max(0, Math.round(score * 100) / 100);
};

/**
 * Letter grade from A (best) to G (worst) based on EcoIndex score.
 */
export const getEcoIndexGrade = (score: number): string => {
    if (score > 80) return 'A';
    if (score > 70) return 'B';
    if (score > 55) return 'C';
    if (score > 40) return 'D';
    if (score > 25) return 'E';
    if (score > 10) return 'F';
    return 'G';
};

/**
 * Greenhouse gas emissions estimate in gCO₂e per page view.
 * Formula: 2 + 2 * (50 - score) / 100
 */
export const computeGhg = (score: number): number =>
    Math.round((2 + (2 * (50 - score)) / 100) * 100) / 100;

/**
 * Water consumption estimate in cl per page view.
 * Formula: 3 + 3 * (50 - score) / 100
 */
export const computeWater = (score: number): number =>
    Math.round((3 + (3 * (50 - score)) / 100) * 100) / 100;
