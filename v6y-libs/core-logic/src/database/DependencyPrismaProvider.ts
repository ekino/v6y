/**
 * Prisma-based Dependency Provider
 * Manages external dependencies and vulnerabilities
 */
import AppLogger from '../core/AppLogger.ts';
import { prisma } from './PrismaClient.ts';

const logger = AppLogger.getInstance();

export interface DependencyInput {
    appId: number;
    auditExecutionId: string;
    ecosystemType: string;
    packageName: string;
    currentVersion?: string;
    latestVersion?: string;
    status?: string;
    vulnerabilityCount?: number;
    maxSeverity?: string;
    updateAvailable?: boolean;
    metadata?: Record<string, unknown>;
}

export class DependencyPrismaProvider {
    /**
     * Save a dependency record
     */
    async saveDependency(data: DependencyInput) {
        try {
            return await prisma.dependency.create({
                data: {
                    appId: data.appId,
                    auditExecutionId: data.auditExecutionId,
                    ecosystemType: data.ecosystemType,
                    packageName: data.packageName,
                    currentVersion: data.currentVersion,
                    latestVersion: data.latestVersion,
                    status: data.status,
                    vulnerabilityCount: data.vulnerabilityCount || 0,
                    maxSeverity: data.maxSeverity,
                    updateAvailable: data.updateAvailable || false,
                    metadata: data.metadata,
                },
            });
        } catch (error) {
            logger.error(
                `Failed to save dependency ${data.packageName} for app ${data.appId}`,
                error,
            );
            throw error;
        }
    }

    /**
     * Get latest dependencies for an application
     */
    async getLatestDependencies(appId: number) {
        try {
            const executions = await prisma.auditExecution.findMany({
                where: { appId },
                orderBy: { executedAt: 'desc' },
                take: 1,
            });

            if (executions.length === 0) {
                return [];
            }

            const latestExecution = executions[0];

            return await prisma.dependency.findMany({
                where: {
                    appId,
                    auditExecutionId: latestExecution.id,
                },
                orderBy: { ecosystemType: 'asc' },
            });
        } catch (error) {
            logger.error(`Failed to get latest dependencies for app ${appId}`, error);
            throw error;
        }
    }

    /**
     * Get vulnerable dependencies
     */
    async getVulnerableDependencies(appId: number) {
        try {
            return await prisma.dependency.findMany({
                where: {
                    appId,
                    vulnerabilityCount: { gt: 0 },
                },
                orderBy: { vulnerabilityCount: 'desc' },
            });
        } catch (error) {
            logger.error(`Failed to get vulnerable dependencies for app ${appId}`, error);
            throw error;
        }
    }

    /**
     * Get outdated dependencies (with newer versions available)
     */
    async getOutdatedDependencies(appId: number) {
        try {
            return await prisma.dependency.findMany({
                where: {
                    appId,
                    updateAvailable: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            logger.error(`Failed to get outdated dependencies for app ${appId}`, error);
            throw error;
        }
    }
}

export default new DependencyPrismaProvider();
