import AppLogger from '../core/AppLogger.ts';
import { ModuleType } from '../types/ModuleType.ts';
import { ModuleModelType } from './models/ModuleModel.ts';

/**
 * Finds an existing module record or creates a new one.
 * Modules are deduplicated by (appId, branch, path).
 */
const findOrCreateModule = async (module: ModuleType): Promise<ModuleType | null> => {
    try {
        if (!module?.appId) {
            return null;
        }

        const [instance] = await ModuleModelType.findOrCreate({
            where: {
                appId: module.appId,
                branch: module.branch ?? undefined,
                path: module.path ?? undefined,
            },
            defaults: {
                appId: module.appId,
                branch: module.branch,
                path: module.path,
                url: module.url,
                status: module.status,
                version: module.version,
            },
        });

        AppLogger.info(
            `[ModuleProvider - findOrCreateModule] module _id: ${instance?.dataValues?._id}`,
        );

        return instance?.dataValues ?? null;
    } catch (error) {
        AppLogger.info(`[ModuleProvider - findOrCreateModule] error: ${error}`);
        return null;
    }
};

/**
 * Fetches all modules for a given application.
 */
const getModulesByAppId = async ({ appId }: { appId: number }): Promise<ModuleType[]> => {
    try {
        AppLogger.info(`[ModuleProvider - getModulesByAppId] appId: ${appId}`);

        const modules = await ModuleModelType.findAll({ where: { appId } });

        return modules.map((m) => m.dataValues);
    } catch (error) {
        AppLogger.info(`[ModuleProvider - getModulesByAppId] error: ${error}`);
        return [];
    }
};

/**
 * Deletes all module records belonging to an application.
 */
const deleteModulesByAppId = async ({ appId }: { appId: number }): Promise<boolean> => {
    try {
        await ModuleModelType.destroy({ where: { appId } });
        return true;
    } catch (error) {
        AppLogger.info(`[ModuleProvider - deleteModulesByAppId] error: ${error}`);
        return false;
    }
};

const ModuleProvider = {
    findOrCreateModule,
    getModulesByAppId,
    deleteModulesByAppId,
};

export default ModuleProvider;
