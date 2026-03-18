/**
 * Prisma-based Audit Provider
 * Handles audit execution and dimension queries
 */
import AppLogger from '../core/AppLogger.ts';
import { prisma } from './PrismaClient.ts';

const logger = AppLogger.getInstance();

export interface AuditDimensionInput {
    executionId: string;
    appId: number;
    sourceId: number;
    category: string;
    metric: string;
    value?: number;
    unit?: string;
    status?: string;
    trend?: number;
    metadata?: Record<string, unknown>;
}

export interface AuditDimensionOutput extends AuditDimensionInput {
    _id: bigint;
    createdAt: Date;
}

export class AuditPrismaProvider {
    /**
     * Create a new audit execution
     */
    async createExecution(appId: number, initiatedBy: string = 'SCHEDULED') {
        try {
            const execution = await prisma.auditExecution.create({
                data: {
                    appId,
                    initiatedBy,
                    status: 'PENDING',
                    executedAt: new Date(),
                },
            });
            return execution;
        } catch (error) {
            logger.error(`Failed to create audit execution for app ${appId}`, error);
            throw error;
        }
    }

    /**
     * Complete an audit execution
     */
    async completeExecution(executionId: string, status: string = 'COMPLETED') {
        try {
            const execution = await prisma.auditExecution.update({
                where: { id: executionId },
                data: {
                    status,
                    completedAt: new Date(),
                },
            });
            return execution;
        } catch (error) {
            logger.error(`Failed to complete audit execution ${executionId}`, error);
            throw error;
        }
    }

    /**
     * Save an audit dimension (metric result)
     */
    async saveDimension(data: AuditDimensionInput): Promise<AuditDimensionOutput> {
        try {
            const dimension = await prisma.auditDimension.create({
                data: {
                    executionId: data.executionId,
                    appId: data.appId,
                    sourceId: data.sourceId,
                    category: data.category,
                    metric: data.metric,
                    value: data.value,
                    unit: data.unit,
                    status: data.status,
                    trend: data.trend,
                    metadata: data.metadata,
                },
            });
            return dimension as AuditDimensionOutput;
        } catch (error) {
            logger.error(`Failed to save audit dimension for metric ${data.metric}`, error);
            throw error;
        }
    }

    /**
     * Get latest audit results for an application
     */
    async getLatestDimensions(appId: number, limit: number = 100) {
        try {
            return await prisma.auditDimension.findMany({
                where: { appId },
                include: {
                    execution: true,
                    source: true,
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
        } catch (error) {
            logger.error(`Failed to get latest audit dimensions for app ${appId}`, error);
            throw error;
        }
    }

    /**
     * Get audit results by source (tool)
     */
    async getDimensionsBySource(appId: number, sourceName: string) {
        try {
            return await prisma.auditDimension.findMany({
                where: {
                    appId,
                    source: { name: sourceName },
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            logger.error(
                `Failed to get dimensions by source ${sourceName} for app ${appId}`,
                error,
            );
            throw error;
        }
    }

    /**
     * Get audit results for a specific execution
     */
    async getDimensionsByExecution(executionId: string) {
        try {
            return await prisma.auditDimension.findMany({
                where: { executionId },
                include: { source: true },
                orderBy: { metric: 'asc' },
            });
        } catch (error) {
            logger.error(`Failed to get dimensions for execution ${executionId}`, error);
            throw error;
        }
    }

    /**
     * Compare two audit executions
     */
    async compareExecutions(executionId1: string, executionId2: string) {
        try {
            const dims1 = await this.getDimensionsByExecution(executionId1);
            const dims2 = await this.getDimensionsByExecution(executionId2);

            const map1 = new Map(dims1.map((d) => [d.metric, d]));
            const map2 = new Map(dims2.map((d) => [d.metric, d]));

            const comparison = [];
            const allMetrics = new Set([...map1.keys(), ...map2.keys()]);

            for (const metric of allMetrics) {
                const d1 = map1.get(metric);
                const d2 = map2.get(metric);

                comparison.push({
                    metric,
                    value1: d1?.value,
                    value2: d2?.value,
                    pctChange:
                        d1?.value && d2?.value ? ((d2.value - d1.value) / d1.value) * 100 : null,
                });
            }

            return comparison;
        } catch (error) {
            logger.error(`Failed to compare executions ${executionId1} and ${executionId2}`, error);
            throw error;
        }
    }
}

export default new AuditPrismaProvider();
