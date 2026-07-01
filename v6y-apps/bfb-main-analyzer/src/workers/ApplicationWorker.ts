import { parentPort } from 'worker_threads';

import { AppLogger, DataBaseManager, DependencyProvider } from '@v6y/core-logic';

import ApplicationManager from '../managers/ApplicationManager.ts';

const { buildApplicationList } = ApplicationManager;

AppLogger.info('🔄 [ApplicationWorker] Starting background APP updates');
AppLogger.info(`⏰ [ApplicationWorker] Timestamp: ${new Date().toISOString()}`);

try {
    // *********************************************** Database Configuration and Connection ***********************************************
    AppLogger.info('[ApplicationWorker] Connecting to database...');
    await DataBaseManager.connect();
    AppLogger.info('[ApplicationWorker] ✅ Database connected');

    // *********************************************** Update APP List ***********************************************
    // Note: We don't delete audits anymore because they should be kept for historical tracking
    // with timestamps (createdAt field). Only dependencies are cleared before fresh analysis.
    AppLogger.info('[ApplicationWorker] Clearing old dependencies...');
    await DependencyProvider.deleteDependencyList();
    AppLogger.info('[ApplicationWorker] ✅ Dependencies cleared');

    AppLogger.info('[ApplicationWorker] Starting application analysis...');
    await buildApplicationList();
    AppLogger.info('[ApplicationWorker] ✅ Application analysis completed');
} catch (error) {
    AppLogger.error(`[ApplicationWorker] ❌ Error: ${error}`);
}

AppLogger.info('✅ [ApplicationWorker] APP update completed successfully');

parentPort?.postMessage('✅ [ApplicationWorker] APP update completed successfully');
