import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import { toast } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GenerateApplicationAiSummary from '../api/generateApplicationAiSummary';
import GetApplicationAiSummaryByParams from '../api/getApplicationAiSummaryByParams';

export interface AiSummaryReportData {
    _id: number;
    appId: number;
    summary: string;
    score: number | null;
    model: string | null;
    generatedAt: string | null;
}

/**
 * Encapsulates the "AI synthesis" card behavior: reads the application's
 * cached, generic AI summary (if any) and exposes a "generate" action that
 * calls the BFF mutation. The summary is app-level (not tied to any specific
 * audit report), and every generate call produces a fresh one.
 */
export const useAiSummaryReport = (applicationId?: number) => {
    const { translate, getLocale } = useTranslationProvider();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const {
        isLoading: isLoadingSummary,
        data,
        error: loadError,
        refetch,
    } = useClientQuery<{
        getApplicationAiSummaryByParams: AiSummaryReportData | null;
    }>({
        queryCacheKey: ['getApplicationAiSummaryByParams', `${applicationId ?? 'invalid'}`],
        queryBuilder: async () => {
            if (!applicationId) {
                return { getApplicationAiSummaryByParams: null };
            }

            return buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationAiSummaryByParams,
                variables: { _id: applicationId },
            });
        },
    });

    const report = data?.getApplicationAiSummaryByParams ?? null;

    const onGenerateClicked = React.useCallback(async () => {
        if (!applicationId || Number.isNaN(applicationId)) {
            toast.error(
                translate('vitality.appDetailsPage.aiSummaryCard.toasts.invalidApplication'),
            );
            return;
        }

        setIsGenerating(true);
        try {
            const response = await buildClientQuery<{
                generateApplicationAiSummary: {
                    success: boolean;
                    message: string;
                };
            }>({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GenerateApplicationAiSummary,
                variables: { applicationId, language: getLocale() },
            });

            const result = response?.generateApplicationAiSummary;

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                        translate('vitality.appDetailsPage.aiSummaryCard.toasts.failed'),
                );
            }

            toast.success(translate('vitality.appDetailsPage.aiSummaryCard.toasts.generated'));

            await refetch();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : translate('vitality.appDetailsPage.aiSummaryCard.toasts.failed'),
            );
            console.error('Error generating AI summary:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [applicationId, translate, getLocale, refetch]);

    return {
        isLoadingSummary,
        loadError,
        report,
        isGenerating,
        onGenerateClicked,
        onRetryLoad: refetch,
    };
};

export default useAiSummaryReport;
