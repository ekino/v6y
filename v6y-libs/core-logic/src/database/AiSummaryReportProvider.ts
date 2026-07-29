import AppLogger from '../core/AppLogger.ts';
import { AiSummaryReportType } from '../types/AiSummaryReportType.ts';
import { getPrismaClient } from './PrismaClient.ts';

/**
 * Get the cached AI summary report for an application, if any.
 */
const getByAppId = async (appId: number): Promise<AiSummaryReportType | null> => {
    try {
        if (!appId) {
            return null;
        }

        const report = await getPrismaClient().aiSummaryReport.findUnique({
            where: { appId },
        });

        return report ? { ...report, _id: report.id } : null;
    } catch (error) {
        AppLogger.error('[AiSummaryReportProvider - getByAppId] error: ', error);
        return null;
    }
};

/**
 * Create or replace the cached AI summary report for an application.
 * There is at most one row per application (unique on `appId`), so a new
 * successful generation always overwrites the previous cache entry.
 */
const upsert = async (
    report: Pick<AiSummaryReportType, 'appId' | 'summary' | 'model' | 'tokensUsed'>,
): Promise<AiSummaryReportType | null> => {
    try {
        if (!report?.appId || !report?.summary) {
            AppLogger.error('[AiSummaryReportProvider - upsert] Missing required fields');
            return null;
        }

        const saved = await getPrismaClient().aiSummaryReport.upsert({
            where: { appId: report.appId },
            create: {
                appId: report.appId,
                summary: report.summary,
                model: report.model ?? null,
                tokensUsed: report.tokensUsed ?? null,
            },
            update: {
                summary: report.summary,
                model: report.model ?? null,
                tokensUsed: report.tokensUsed ?? null,
                generatedAt: new Date(),
            },
        });

        AppLogger.info('[AiSummaryReportProvider - upsert] appId: ' + report.appId);
        return { ...saved, _id: saved.id };
    } catch (error) {
        AppLogger.error('[AiSummaryReportProvider - upsert] error: ', error);
        return null;
    }
};

const AiSummaryReportProvider = {
    getByAppId,
    upsert,
};

export default AiSummaryReportProvider;
