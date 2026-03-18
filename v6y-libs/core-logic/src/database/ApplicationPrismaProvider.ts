/**
 * Prisma-based Application Provider
 * Replaces Sequelize ApplicationModel with type-safe Prisma queries
 */
import AppLogger from '../core/AppLogger.ts';
import { prisma } from './PrismaClient.ts';

const logger = AppLogger.getInstance();

export interface ApplicationInput {
    name: string;
    acronym: string;
    contactMail: string;
    description?: string;
    repo?: Record<string, unknown>;
    links?: Record<string, unknown>;
}

export interface ApplicationOutput {
    _id: number;
    name: string;
    acronym: string;
    contactMail: string;
    description?: string;
    repo?: Record<string, unknown>;
    configuration?: Record<string, unknown>;
    links?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export class ApplicationPrismaProvider {
    /**
     * Create a new application
     */
    async create(data: ApplicationInput): Promise<ApplicationOutput> {
        try {
            const application = await prisma.application.create({
                data: {
                    name: data.name,
                    acronym: data.acronym,
                    contactMail: data.contactMail,
                    description: data.description,
                    repo: data.repo,
                    links: data.links,
                },
            });
            return application;
        } catch (error) {
            logger.error(`Failed to create application: ${data.name}`, error);
            throw error;
        }
    }

    /**
     * Get application by ID
     */
    async findById(appId: number): Promise<ApplicationOutput | null> {
        try {
            const application = await prisma.application.findUnique({
                where: { _id: appId },
            });
            return application || null;
        } catch (error) {
            logger.error(`Failed to find application with ID: ${appId}`, error);
            throw error;
        }
    }

    /**
     * Get application by name
     */
    async findByName(name: string): Promise<ApplicationOutput | null> {
        try {
            const application = await prisma.application.findUnique({
                where: { name },
            });
            return application || null;
        } catch (error) {
            logger.error(`Failed to find application with name: ${name}`, error);
            throw error;
        }
    }

    /**
     * Get all applications
     */
    async findAll(): Promise<ApplicationOutput[]> {
        try {
            return await prisma.application.findMany();
        } catch (error) {
            logger.error('Failed to fetch all applications', error);
            throw error;
        }
    }

    /**
     * Update an application
     */
    async update(appId: number, data: Partial<ApplicationInput>): Promise<ApplicationOutput> {
        try {
            const application = await prisma.application.update({
                where: { _id: appId },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.acronym && { acronym: data.acronym }),
                    ...(data.contactMail && { contactMail: data.contactMail }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.repo !== undefined && { repo: data.repo }),
                    ...(data.links !== undefined && { links: data.links }),
                },
            });
            return application;
        } catch (error) {
            logger.error(`Failed to update application ${appId}`, error);
            throw error;
        }
    }

    /**
     * Delete an application
     */
    async delete(appId: number): Promise<boolean> {
        try {
            await prisma.application.delete({
                where: { _id: appId },
            });
            return true;
        } catch (error) {
            logger.error(`Failed to delete application ${appId}`, error);
            throw error;
        }
    }
}

export default new ApplicationPrismaProvider();
