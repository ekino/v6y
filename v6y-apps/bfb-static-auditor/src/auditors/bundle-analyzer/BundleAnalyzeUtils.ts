import { AppLogger, AuditType, AuditUtils } from '@v6y/core-logic';
import { exec, execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';

const { getFrontendDirectories, getPackageManager, getBundler } = AuditUtils;

/**
 * Analyze the bundle using the bundler.
 * @param module
 * @param bundler
 */
const runAnalyzeTool = async (module: string, bundler: string, packageManager: string) => {
    // for now, we only support next.js.
    if (bundler === 'next') {
        // check if the module has @next/bundle-analyzer
        let hasBundleAnalyzer = false;
        try {
            const pkg = JSON.parse(await fs.readFile(path.join(module, 'package.json'), 'utf-8'));
            hasBundleAnalyzer = Boolean(
                (pkg.dependencies && pkg.dependencies['@next/bundle-analyzer']) ||
                    (pkg.devDependencies && pkg.devDependencies['@next/bundle-analyzer']),
            );
        } catch (e) {
            AppLogger.warn(
                `[BundleAnalyzeUtils - runAnalyzeTool] Impossible to read the package.json file: ${e}`,
            );
        }

        if (!hasBundleAnalyzer) {
            AppLogger.warn(
                `[BundleAnalyzeUtils - runAnalyzeTool] No @next/bundle-analyzer found in the module.`,
            );
            return null;
        }

        const analyseCmd = `ANALYZE=true ${packageManager} build`;
        return new Promise((resolve, reject) => {
            exec(analyseCmd, { cwd: module }, async (error, stdout, stderr) => {
                if (error) {
                    AppLogger.error(
                        `[BundleAnalyzeUtils - runAnalyzeTool] error: ${error.message}`,
                    );
                    reject(error);
                    return;
                }
                if (stderr) {
                    AppLogger.error(`[BundleAnalyzeUtils - runAnalyzeTool] stderr: ${stderr}`);
                }
                AppLogger.info(`[BundleAnalyzeUtils - runAnalyzeTool] stdout: ${stdout}`);
                const lines = stdout.split('\n');
                // we now need to parse the output to get the bundles sizes
                console.log('lines', lines);
            });
        });
    } else {
        AppLogger.warn(
            `[BundleAnalyzeUtils - runAnalyzeTool] bundler: ${bundler} is not supported.`,
        );
        return null;
    }
};

/**
 * Analyze the bundle using the bundler.
 * @param modulePath
 * @param packageManager
 */
const analyzeModule = async (
    modulePath: string,
    packageManager: string,
): Promise<AuditType | null> => {
    try {
        const bundler = await getBundler(modulePath);
        if (!bundler) {
            AppLogger.warn(
                `[BundleAnalyzeUtils - analyzeModule] bundler: No bundler found in the frontend module.`,
            );
            return null;
        }

        AppLogger.info(
            `[BundleAnalyzeUtils - analyzeBundle] bundler: ${bundler} found in the frontend module.`,
        );

        const outputAnalyze = await runAnalyzeTool(modulePath, bundler, packageManager);
        AppLogger.debug('outputAnalyze', outputAnalyze);
        if (!outputAnalyze || typeof outputAnalyze !== 'object') return null;

        // here we convert the outputAnalyze to AuditType
        return {} as AuditType;
    } catch (error) {
        AppLogger.error(`[BundleAnalyzeUtils - analyzeBundle] error: ${error}`);
        return null;
    }
};

/**
 * Format bundle analyze reports.
 * @param applicationId
 * @param workspaceFolder
 */
const formatBundleAnalyzeReports = async ({
    applicationId,
    workspaceFolder,
}: AuditCommonsType): Promise<AuditType[]> => {
    try {
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] workspaceFolder:  ${workspaceFolder}`,
        );

        if (!applicationId || !workspaceFolder) {
            return [];
        }

        const frontendModules = getFrontendDirectories(workspaceFolder, []);

        if (!frontendModules.length) {
            AppLogger.warn(
                `[BundleAnalyzeUtils - formatBundleAnalyzeReports] frontendModule: No frontend modules found in the workspace.`,
            );
            return [];
        }

        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] frontendModules: ${frontendModules.length} modules found.`,
        );

        const packageManager = await getPackageManager(workspaceFolder);
        if (!packageManager) {
            AppLogger.warn(
                `[BundleAnalyzeUtils - formatBundleAnalyzeReports] packageManager: No package manager found in the frontend module.`,
            );
            return [];
        }

        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] packageManager: ${packageManager} found in the frontend module.`,
        );

        execSync(`${packageManager} install`, { cwd: workspaceFolder });
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] '${packageManager} install' command executed in the frontend module.`,
        );

        const bundleReports: AuditType[] = [];
        for (const modulePath of frontendModules) {
            const report = await analyzeModule(modulePath, packageManager);
            if (report) {
                bundleReports.push(report);
            }
        }
        return bundleReports;
    } catch (error) {
        AppLogger.error(`[BundleAnalyzeUtils - formatBundleAnalyzeReports] error:  ${error}`);
        return [];
    }
};

const BundleAnalyzeUtils = {
    formatBundleAnalyzeReports,
};

export default BundleAnalyzeUtils;
