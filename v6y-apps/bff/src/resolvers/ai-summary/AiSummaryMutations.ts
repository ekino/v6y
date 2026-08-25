import {
    AccountType,
    AiSummaryReportProvider,
    AiSummaryUtils,
    AppLogger,
    ApplicationProvider,
    AuditProvider,
    DependencyProvider,
    LiteLLMApi,
} from '@v6y/core-logic';

/**
 * Generate a generic AI summary report for an application (name, description,
 * tech stack and current audit health, aggregated across categories from the
 * latest audit run), independent of any single specific audit report.
 *
 * There is at most one cached summary per application: every call is a
 * manual "generate"/"regenerate" action that invokes the LLM and overwrites
 * the previous cache entry.
 * @param _
 * @param params
 * @param user
 */
const generateApplicationAiSummary = async (
    _: unknown,
    params: { applicationId: number; language?: string },
    { user }: { user: AccountType },
) => {
    const { applicationId, language } = params || {};

    try {
        if (!applicationId) {
            throw new Error('The applicationId is required');
        }

        if (!(user.role === 'ADMIN' || user.role === 'SUPERADMIN')) {
            const userApplicationsIds = user.applications || [];
            if (!userApplicationsIds.includes(applicationId)) {
                throw new Error('Unauthorized');
            }
        }

        AppLogger.info(
            `[AiSummaryMutations - generateApplicationAiSummary] applicationId : ${applicationId}`,
        );

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application) {
            return {
                success: false,
                message: 'Application not found.',
                report: null,
            };
        }

        const dependencies = await DependencyProvider.getDependencyListByPageAndParams({
            appId: applicationId,
        });

        // Read the application's full audit history rather than only the single most
        // recently triggered audit run: that latest run may only have re-analyzed a subset
        // of categories (e.g. just performance), which would silently drop other categories
        // (security, devops, ecodesign, accessibility, maintainability, ...) last audited by
        // an earlier run. buildAuditHealthSummary below keeps, per category, whichever audit
        // sorts last - so sorting this full list ascending by date yields the most recent
        // result for every category that has ever been audited.
        const audits = await AuditProvider.getAuditListByPageAndParams({ appId: applicationId });

        const sortedAudits = [...(audits || [])].sort((a, b) => {
            const aDate = new Date(a?.dateEnd ?? a?.dateStart ?? 0).getTime();
            const bDate = new Date(b?.dateEnd ?? b?.dateStart ?? 0).getTime();
            return aDate - bDate;
        });

        const techStack = AiSummaryUtils.buildTechStackSummary(dependencies || []);
        const auditHealth = AiSummaryUtils.buildAuditHealthSummary(sortedAudits);
        const { system, user: userPrompt } = AiSummaryUtils.buildAiSummaryPrompt({
            application,
            techStack,
            auditHealth,
            language,
        });

        const completion = await LiteLLMApi.generateChatCompletion(
            [
                { role: 'system', content: system },
                { role: 'user', content: userPrompt },
            ],
            { responseFormat: AiSummaryUtils.AI_SUMMARY_RESPONSE_FORMAT },
        );

        // The model is asked to answer as strict JSON ({"bullets": string[], "score": number})
        // rather than free-form text, so the response can't come back as unstructured or
        // inconsistently formatted prose. parseAiSummaryBullets still falls back to
        // plain-text parsing if a provider ever ignores the JSON instruction.
        const bullets = AiSummaryUtils.parseAiSummaryBullets(completion.content);
        const score = AiSummaryUtils.parseAiSummaryScore(completion.content);

        const savedReport = await AiSummaryReportProvider.upsert({
            appId: applicationId,
            summary: bullets.join('\n'),
            score,
            model: completion.model,
            tokensUsed: completion.tokensUsed,
        });

        if (!savedReport) {
            throw new Error('The summary was generated but could not be saved');
        }

        return {
            success: true,
            message: 'Summary generated successfully.',
            report: savedReport,
        };
    } catch (error) {
        AppLogger.error(`[AiSummaryMutations - generateApplicationAiSummary] error : ${error}`);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unable to generate the AI summary at this time.',
            report: null,
        };
    }
};

const AiSummaryMutations = {
    generateApplicationAiSummary,
};

export default AiSummaryMutations;
