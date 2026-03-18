/**
 * Prisma-based Configuration Provider
 * Manages tool configuration per application
 */
import AppLogger from '../core/AppLogger.ts';
import { prisma } from './PrismaClient.ts';

const logger = AppLogger.getInstance();

export interface ConfigurationInput {
    appId: number;
    toolName: string;
    isEnabled?: boolean;
    credentials?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    webhookUrl?: string;
}

export class ConfigurationPrismaProvider {
    /**
     * Get or create configuration for a tool
     */
    async getOrCreate(appId: number, toolName: string) {
        try {
            let config = await prisma.configuration.findUnique({
                where: {
                    appId_toolName: { appId, toolName },
                },
            });

            if (!config) {
                config = await prisma.configuration.create({
                    data: {
                        appId,
                        toolName,
                        isEnabled: false,
                    },
                });
            }

            return config;
        } catch (error) {
            logger.error(
                `Failed to get/create configuration for app ${appId}, tool ${toolName}`,
                error,
            );
            throw error;
        }
    }

    /**
     * Update tool configuration
     */
    async update(appId: number, toolName: string, data: Partial<ConfigurationInput>) {
        try {
            return await prisma.configuration.update({
                where: {
                    appId_toolName: { appId, toolName },
                },
                data: {
                    ...(data.isEnabled !== undefined && { isEnabled: data.isEnabled }),
                    ...(data.credentials && { credentials: data.credentials }),
                    ...(data.settings && { settings: data.settings }),
                    ...(data.webhookUrl && { webhookUrl: data.webhookUrl }),
                    updatedAt: new Date(),
                },
            });
        } catch (error) {
            logger.error(
                `Failed to update configuration for app ${appId}, tool ${toolName}`,
                error,
            );
            throw error;
        }
    }

    /**
     * Get all enabled configurations for an app
     */
    async getEnabledConfigurations(appId: number) {
        try {
            return await prisma.configuration.findMany({
                where: {
                    appId,
                    isEnabled: true,
                },
            });
        } catch (error) {
            logger.error(`Failed to get enabled configurations for app ${appId}`, error);
            throw error;
        }
    }

    /**
     * Update last synced time
     */
    async updateLastSyncedAt(appId: number, toolName: string, syncedAt?: Date) {
        try {
            return await prisma.configuration.update({
                where: {
                    appId_toolName: { appId, toolName },
                },
                data: {
                    lastSyncedAt: syncedAt || new Date(),
                    updatedAt: new Date(),
                },
            });
        } catch (error) {
            logger.error(
                `Failed to update last synced time for app ${appId}, tool ${toolName}`,
                error,
            );
            throw error;
        }
    }
}

export default new ConfigurationPrismaProvider();
