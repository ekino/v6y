import { AppLogger, AuditType, AuditUtils, auditStatus, scoreStatus } from '@v6y/core-logic';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';

const { getFrontendDirectories, getPackageManager, getBundler } = AuditUtils;

/**
 * Format the bundle analyze reports.
 * @param applicationId
 * @param workspaceFolder
 */
const formatBundleAnalyzeReports = async ({
    applicationId,
    workspaceFolder,
}: AuditCommonsType): Promise<AuditType[]> => {
    try {
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] applicationId: ${applicationId}`,
        );
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] workspaceFolder: ${workspaceFolder}`,
        );
        if (!applicationId || !workspaceFolder) {
            AppLogger.warn('[BundleAnalyzeUtils] applicationId or workspaceFolder missing.');
            return [];
        }
        const frontendModules = getFrontendDirectories(workspaceFolder, []);
        if (!frontendModules.length) {
            AppLogger.warn('[BundleAnalyzeUtils] No frontend module found.');
            return [];
        } else {
            AppLogger.info(
                `[BundleAnalyzeUtils] ${frontendModules.length} frontend modules found.`,
            );
        }

        const packageManager = await getPackageManager(workspaceFolder);
        if (!packageManager) {
            AppLogger.warn('[BundleAnalyzeUtils] No package manager found.');
            return [];
        }
        AppLogger.info(`[BundleAnalyzeUtils] packageManager: ${packageManager}`);

        await installDependencies(packageManager, workspaceFolder);

        const bundleReports: AuditType[] = [];
        for (const modulePath of frontendModules) {
            const analyseResult = await analyzeModule(modulePath, packageManager);

            const module = {
                appId: applicationId,
                path: path.relative(workspaceFolder, modulePath),
                name: path.basename(modulePath),
            };
            if (!analyseResult) {
                AppLogger.warn(
                    `[BundleAnalyzeUtils] L'analyse du module ${module.name} n'a pas abouti.`,
                );
            } else if (analyseResult?.status === 'error') {
                bundleReports.push({
                    appId: applicationId,
                    type: 'bundle-analyze',
                    category: 'bundle-max-size',
                    auditStatus: auditStatus.failure,
                    score: null,
                    scoreStatus: null,
                    scoreUnit: 'bytes',
                    module: module,
                    extraInfos: analyseResult?.extraInfos,
                });
            } else {
                bundleReports.push({
                    appId: applicationId,
                    type: 'bundle-analyze',
                    category: 'bundle-max-size',
                    auditStatus: auditStatus.success,
                    score: analyseResult?.report?.gzipSize,
                    scoreStatus: analyseResult?.report
                        ? getScoreStatus(analyseResult?.report?.gzipSize)
                        : null,
                    scoreUnit: 'bytes',
                    module: module,
                    extraInfos: analyseResult?.extraInfos,
                });
            }
        }
        return bundleReports;
    } catch (error) {
        AppLogger.error(`[BundleAnalyzeUtils] Erreur globale: ${error}`);
        return [];
    }
};

/**
 * Installs the dependencies of the project using the specified package manager.
 * @param packageManager - The package manager to use (e.g., npm, yarn).
 * @param workspaceFolder - The path to the workspace folder.
 */
const installDependencies = async (packageManager: string, workspaceFolder: string) => {
    try {
        AppLogger.info(
            `[BundleAnalyzeUtils] Installing dependencies with '${packageManager} install'...`,
        );
        execSync(`${packageManager} install`, { cwd: workspaceFolder });
    } catch (error) {
        AppLogger.error(`[BundleAnalyzeUtils] Error while installing dependencies: ${error}`);
        throw error;
    }
};

type AnalyzeResult = {
    status: 'success' | 'error';
    report?: { gzipSize: number };
    extraInfos?: string;
} | null;

/**
 * Analyzes the module using the specified package manager.
 * @param modulePath - The path to the module to analyze.
 * @param packageManager - The package manager to use (e.g., npm, yarn).
 */
async function analyzeModule(modulePath: string, packageManager: string): Promise<AnalyzeResult> {
    try {
        AppLogger.info(`[BundleAnalyzeUtils] Analyzing module: ${path.basename(modulePath)}`);

        const bundler = await getBundler(modulePath);
        if (!bundler) {
            AppLogger.warn('[BundleAnalyzeUtils] No bundler detected.');
            return { status: 'error', extraInfos: 'No bundler detected in the module.' };
        }
        AppLogger.info(`[BundleAnalyzeUtils] Bundler detected: ${bundler}`);

        const supportedBundlers = ['next'];
        if (!supportedBundlers.includes(bundler)) {
            AppLogger.warn(`[BundleAnalyzeUtils] Unsupported bundler: ${bundler}`);
            return null;
        }

        const outputAnalyze = await runAnalyzeTool(modulePath, bundler, packageManager);

        if (!outputAnalyze) {
            return {
                status: 'error',
                extraInfos:
                    'Cannot analyze the bundle. Did you set up the bundle analyzer in your project?',
            };
        }
        return { status: 'success', report: outputAnalyze };
    } catch (error) {
        AppLogger.error(`[BundleAnalyzeUtils] Error in analyzeModule: ${error}`);
        return { status: 'error', extraInfos: 'Unexpected error occurred during analysis.' };
    }
}

interface AnalyzeToolResult {
    gzipSize: number;
}
/**
 * Runs the analysis tool for the specified module and bundler.
 * @param module - The path to the module to analyze.
 * @param bundler - The bundler to use (e.g., next).
 * @param packageManager - The package manager to use (e.g., pnpm, yarn).
 */
const runAnalyzeTool = async (
    module: string,
    bundler: string,
    packageManager: string,
): Promise<AnalyzeToolResult | null> => {
    if (!(await isBundlerAnalyzerSetup(module, bundler))) return null;

    AppLogger.info(
        `[BundleAnalyzeUtils - runAnalyzeToolRefactored] Bundler analyzer correctly set up.`,
    );
    AppLogger.info(
        `[BundleAnalyzeUtils - runAnalyzeToolRefactored] Running the analyze command...`,
    );
    if (bundler === 'next') {
        const analyzeCmd = `ANALYZE=true ${packageManager} build`;
        try {
            execSync(analyzeCmd, { cwd: module, stdio: 'inherit' });
        } catch (error) {
            AppLogger.error(`[BundleAnalyzeUtils] Build error: ${error}`);
            return null;
        }
        const analyzeFilePath = path.join(module, '.next', 'analyze', 'client.html');
        const raw = await fs.readFile(analyzeFilePath, 'utf-8');
        const bundles = JSON.parse(raw);
        const sorted = [...bundles].sort((a, b) => b.gzipSize - a.gzipSize);
        return sorted[0] || null;
    }
    return null;
};

/**
 * Checks if the bundler analyzer is set up correctly in the module.
 * @param module - The path to the module to check.
 * @param bundler - The bundler to check (e.g., next).
 */
const isBundlerAnalyzerSetup = async (module: string, bundler: string): Promise<boolean> => {
    try {
        if (bundler === 'next') {
            const pkg = JSON.parse(await fs.readFile(path.join(module, 'package.json'), 'utf-8'));
            const hasBundleAnalyzerDependency =
                (pkg.dependencies && pkg.dependencies['@next/bundle-analyzer']) ||
                (pkg.devDependencies && pkg.devDependencies['@next/bundle-analyzer']);

            if (!hasBundleAnalyzerDependency) {
                AppLogger.warn(`[BundleAnalyzeUtils] No @next/bundle-analyzer found in ${module}`);
                return false;
            }

            const files = await fs.readdir(module);
            const configFile = files.find((f) => /^next\.config\.(js|mjs|cjs|ts)$/.test(f));
            if (!configFile) {
                AppLogger.warn(`[BundleAnalyzeUtils] No next.config file found in ${module}`);
                return false;
            }
            const nextConfigPath = path.join(module, configFile);
            try {
                const configContent = await fs.readFile(nextConfigPath, 'utf-8');
                const hasAnalyzerModeJson = /analyzerMode\s*:\s*['"]json['"]/.test(configContent);
                const hasEnabledAnalyzeEnv =
                    /enabled\s*:\s*process\.env\.ANALYZE\s*===\s*['"]true['"]/.test(configContent);
                return hasAnalyzerModeJson && hasEnabledAnalyzeEnv;
            } catch (e) {
                AppLogger.warn(`[BundleAnalyzeUtils] Unable to read next.config.js: ${e}`);
                return false;
            }
        }
        return false;
    } catch (e) {
        AppLogger.warn(`[BundleAnalyzeUtils] Unable to read package.json: ${e}`);
        return false;
    }
};

/**
 * Returns the score status based on the provided gzip size in bytes.
 *
 * The thresholds are based on web statistics as of April 1st, 2024:
 * - Success: gzip size is less than 200 KB (5% of websites are below this size)
 * - Info: gzip size is less than 600 KB (10% of websites are below this size)
 * - Warning: gzip size is less than 1 MB (20% of websites are below this size)
 * - Error: gzip size is 1 MB or more (30% of websites are below 1.5 MB)
 *
 * @param gzipSize - The size of the bundle in bytes after gzip compression.
 */
const getScoreStatus = (gzipSize: number): string => {
    if (gzipSize < 200 * 1024) {
        return scoreStatus.success;
    } else if (gzipSize < 600 * 1024) {
        return scoreStatus.info;
    } else if (gzipSize < 1 * 1024 * 1024) {
        return scoreStatus.warning;
    } else {
        return scoreStatus.error;
    }
};

const BundleAnalyzeUtils = {
    formatBundleAnalyzeReports,
};

export default BundleAnalyzeUtils;
export { installDependencies, analyzeModule };
