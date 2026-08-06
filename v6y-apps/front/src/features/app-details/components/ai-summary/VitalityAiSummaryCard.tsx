import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import { Badge, Button, ReloadIcon, Sparkles } from '@v6y/ui-kit-front';

import { getScoreStatusColor } from '../../../../commons/utils/StatusUtils';
import { useAiSummaryReport } from '../../hooks/useAiSummaryReport';

interface VitalityAiSummaryCardProps {
    applicationId?: number;
}

const formatGeneratedAt = (generatedAt: string | null) => {
    if (!generatedAt) {
        return null;
    }

    const parsed = new Date(generatedAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toLocaleString();
};

/**
 * Maps a 0-10 AI health score to one of the platform's shared status keys
 * (success / warning / error), so the score pill reuses the exact same tonal
 * colors as the audit report status pills instead of a louder, off-palette badge.
 */
const getScoreStatusKey = (score: number) => {
    if (score >= 7) {
        return 'success';
    }
    if (score >= 4) {
        return 'warning';
    }
    return 'error';
};

/**
 * Renders a plain-text AI summary (one recommendation per line, optionally
 * prefixed with "-" or "•") as a proper bullet list: strips the leading
 * marker, adds a visual bullet + spacing per item, and turns any leftover
 * "**bold**" markdown segments into real bold text instead of showing the
 * literal asterisks.
 */
const renderSummaryLines = (summary: string) => {
    const lines = summary
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    return (
        <ul className="text-sm text-gray-700 space-y-3" data-testid="ai-summary-card-content">
            {lines.map((line, lineIndex) => {
                const content = line.replace(/^[-•]\s*/, '');
                return (
                    <li
                        key={`ai-summary-line-${lineIndex}`}
                        className="flex items-start gap-2.5 animate-fade-in-up"
                        style={{ '--stagger-delay': `${lineIndex * 70}ms` } as React.CSSProperties}
                    >
                        <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-violet-500"
                            aria-hidden="true"
                        />
                        <span className="leading-relaxed">
                            {content
                                .split(/(\*\*[^*]+\*\*)/g)
                                .map((part, partIndex) =>
                                    part.startsWith('**') && part.endsWith('**') ? (
                                        <strong key={partIndex}>{part.slice(2, -2)}</strong>
                                    ) : (
                                        <React.Fragment key={partIndex}>{part}</React.Fragment>
                                    ),
                                )}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

/**
 * Small AI-branded icon chip used in the card header, giving the AI card a
 * subtle visual identity while staying harmonious with the plain white
 * sibling cards on the page.
 */
const AiIconChip = () => (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500/10 to-violet-500/10 ring-1 ring-inset ring-indigo-500/20">
        <Sparkles className="w-4 h-4 text-indigo-600" />
    </span>
);

/**
 * "AI synthesis" card: shows a cached, generic AI-generated list of
 * recommended next actions for the application (based on its tech stack and
 * current audit health) and lets the user (re)generate it on demand. It is
 * app-level, not tied to any specific audit report, and stays resilient to
 * load or generation failures (never blocks the rest of the page).
 */
const VitalityAiSummaryCard = ({ applicationId }: VitalityAiSummaryCardProps) => {
    const { translate } = useTranslationProvider();
    const { isLoadingSummary, loadError, report, isGenerating, onGenerateClicked, onRetryLoad } =
        useAiSummaryReport(applicationId);

    const generatedAtLabel = formatGeneratedAt(report?.generatedAt ?? null);

    if (isLoadingSummary) {
        return (
            <div
                className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 space-y-4"
                data-testid="ai-summary-card-loading"
            >
                <div className="flex items-center gap-3">
                    <AiIconChip />
                    <div className="h-5 w-1/2 rounded skeleton-shimmer" />
                </div>
                <div className="space-y-3">
                    <div className="h-3 w-full rounded-full skeleton-shimmer" />
                    <div className="h-3 w-11/12 rounded-full skeleton-shimmer" />
                    <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 space-y-4"
            data-testid="ai-summary-card"
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <AiIconChip />
                    <h2 className="text-lg font-bold text-gray-900">
                        {translate('vitality.appDetailsPage.aiSummaryCard.title')}
                    </h2>
                </div>
                {!loadError && !isGenerating && typeof report?.score === 'number' && (
                    <Badge
                        variant="outline"
                        className={getScoreStatusColor(getScoreStatusKey(report.score))}
                        data-testid="ai-summary-card-score"
                    >
                        {report.score}/10
                    </Badge>
                )}
            </div>

            {loadError && (
                <div className="text-sm text-red-600" data-testid="ai-summary-card-load-error">
                    {translate('vitality.appDetailsPage.aiSummaryCard.loadError')}
                    <button
                        type="button"
                        className="ml-2 underline text-slate-700 hover:text-slate-900"
                        onClick={() => onRetryLoad()}
                    >
                        {translate('vitality.appDetailsPage.aiSummaryCard.retry')}
                    </button>
                </div>
            )}

            {!loadError && isGenerating && (
                <div className="space-y-4" data-testid="ai-summary-card-generating">
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 animate-pulse">
                        <span>
                            {translate('vitality.appDetailsPage.aiSummaryCard.generatingStatus')}
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div className="h-3 w-full rounded-full skeleton-shimmer" />
                        <div className="h-3 w-11/12 rounded-full skeleton-shimmer" />
                        <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
                        <div className="h-3 w-full rounded-full skeleton-shimmer" />
                        <div className="h-3 w-3/5 rounded-full skeleton-shimmer" />
                    </div>
                </div>
            )}

            {!loadError && !isGenerating && !report && (
                <p className="text-sm text-gray-600" data-testid="ai-summary-card-empty">
                    {translate('vitality.appDetailsPage.aiSummaryCard.empty')}
                </p>
            )}

            {!loadError && !isGenerating && report && renderSummaryLines(report.summary)}

            {!loadError && !isGenerating && report && (generatedAtLabel || report.model) && (
                <div className="text-xs text-gray-400 space-x-2">
                    {generatedAtLabel && (
                        <span>
                            {translate('vitality.appDetailsPage.aiSummaryCard.generatedAt').replace(
                                '{date}',
                                generatedAtLabel,
                            )}
                        </span>
                    )}
                    {report.model && <span>· {report.model}</span>}
                </div>
            )}

            {!loadError && (
                <Button
                    onClick={onGenerateClicked}
                    disabled={isGenerating}
                    variant="outline"
                    size="sm"
                    className="w-full h-9 flex items-center justify-center gap-1.5"
                >
                    {isGenerating ? (
                        <>
                            <ReloadIcon className="w-4 h-4 animate-spin" />
                            <span>
                                {translate(
                                    'vitality.appDetailsPage.aiSummaryCard.generatingButton',
                                )}
                            </span>
                        </>
                    ) : (
                        <span>
                            {report
                                ? translate(
                                      'vitality.appDetailsPage.aiSummaryCard.regenerateButton',
                                  )
                                : translate('vitality.appDetailsPage.aiSummaryCard.generateButton')}
                        </span>
                    )}
                </Button>
            )}
        </div>
    );
};

export default VitalityAiSummaryCard;
