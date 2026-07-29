export interface AiSummaryDependencyInput {
    type?: string | null;
    name?: string | null;
    version?: string | null;
}

export interface AiSummaryApplicationInput {
    name?: string | null;
    description?: string | null;
}

export interface AiTechStackSummary {
    type: string;
    count: number;
    examples: string[];
}

export interface AiSummaryAuditInput {
    category?: string | null;
    type?: string | null;
    score?: number | null;
    scoreStatus?: string | null;
    scoreUnit?: string | null;
}

export interface AiAuditHealthSummary {
    category: string;
    score: number | null;
    scoreStatus: string | null;
    scoreUnit: string | null;
}

/**
 * Reduces a raw list of dependencies into a compact, per-type tech stack
 * summary (count + a handful of example names). This is the payload actually
 * sent to the LLM: sending condensed aggregates instead of the full
 * dependency list keeps prompts short and therefore token usage (and cost) low.
 */
const buildTechStackSummary = (
    dependencies: AiSummaryDependencyInput[] = [],
): AiTechStackSummary[] => {
    const byType = new Map<string, { count: number; examples: string[] }>();

    dependencies.forEach((dependency) => {
        const type = dependency?.type || 'other';
        const entry = byType.get(type) || { count: 0, examples: [] };

        entry.count += 1;
        if (dependency?.name && entry.examples.length < 5) {
            entry.examples.push(dependency.name);
        }
        byType.set(type, entry);
    });

    return Array.from(byType.entries())
        .map(([type, entry]) => ({ type, count: entry.count, examples: entry.examples }))
        .sort((a, b) => a.type.localeCompare(b.type));
};

/**
 * Reduces the audits of the application's latest audit run into a compact
 * per-category health summary (one entry per category, keeping its score,
 * score status and unit). This is what lets the generated summary reflect
 * the application's actual, current audit results rather than only its
 * static metadata.
 */
const buildAuditHealthSummary = (audits: AiSummaryAuditInput[] = []): AiAuditHealthSummary[] => {
    const byCategory = new Map<string, AiAuditHealthSummary>();

    audits.forEach((audit) => {
        const category = audit?.category || audit?.type || 'other';

        byCategory.set(category, {
            category,
            score: audit?.score ?? null,
            scoreStatus: audit?.scoreStatus ?? null,
            scoreUnit: audit?.scoreUnit ?? null,
        });
    });

    return Array.from(byCategory.values()).sort((a, b) => a.category.localeCompare(b.category));
};

/**
 * Maps a UI locale code (as returned by the language selector, e.g. `en`/`fr`)
 * to the language name used to instruct the LLM. Defaults to English for any
 * unrecognized or missing locale.
 */
const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    fr: 'French',
};

const resolveLanguageName = (language?: string | null): string =>
    LANGUAGE_NAMES[language || ''] || LANGUAGE_NAMES.en;

/**
 * Builds a minimal chat prompt (system + user messages) instructing the model
 * to produce a short, plain-language summary of the application's current
 * health (based on its tech stack and current audit health), aimed at a
 * non-technical audience: mostly a simple status overview, with at most one
 * or two concrete next steps rather than a full technical checklist. The
 * audit data is aggregated across categories from the latest audit run
 * rather than referring to one particular report. The response language
 * follows the given locale (defaults to English), so the summary matches
 * whatever language is currently selected in the UI.
 */
const buildAiSummaryPrompt = ({
    application,
    techStack,
    auditHealth = [],
    language,
}: {
    application: AiSummaryApplicationInput;
    techStack: AiTechStackSummary[];
    auditHealth?: AiAuditHealthSummary[];
    language?: string | null;
}): { system: string; user: string } => {
    const techStackLines = techStack
        .map(
            (stack) =>
                `- ${stack.type}: ${stack.count} dependencies (e.g. ${stack.examples.join(', ') || 'n/a'})`,
        )
        .join('\n');

    const auditHealthLines = auditHealth
        .map(
            (audit) =>
                `- ${audit.category}: ${audit.score ?? 'n/a'}${audit.scoreUnit ? audit.scoreUnit : ''}` +
                (audit.scoreStatus ? ` (${audit.scoreStatus})` : ''),
        )
        .join('\n');

    const languageName = resolveLanguageName(language);

    const system =
        'You are a technical advisor writing for a non-expert, business-oriented audience (e.g. ' +
        "a product owner), based only on the application's name, description, tech stack and " +
        'latest audit results provided below. Produce a short, plain-language summary of the ' +
        "application's current health. Avoid technical jargon and raw metric or tool names " +
        '(e.g. say "the code is hard to maintain" rather than naming a specific metric or score). ' +
        'Most bullet points should simply describe the current state in accessible terms; include ' +
        'at most one or two next steps to prioritize, only when the audit health clearly shows a ' +
        `problem, and keep them short and non-technical. Respond in ${languageName}. Limit the ` +
        'answer to at most 4 short bullet points. Do not use markdown formatting (no "**", "#", ' +
        'etc.): plain text bullet points starting with "-" only. If there is no audit data ' +
        'available, simply mention that no audit has been run yet. Do not invent information ' +
        'that is not present in the provided data.';

    const user =
        `Application: ${application?.name || 'unknown'}\n` +
        `Description: ${application?.description || 'n/a'}\n` +
        `Tech stack:\n${techStackLines || '- no dependency data available'}\n` +
        `Latest audit results:\n${auditHealthLines || '- no audit data available'}`;

    return { system, user };
};

const AiSummaryUtils = {
    buildTechStackSummary,
    buildAuditHealthSummary,
    buildAiSummaryPrompt,
};

export default AiSummaryUtils;
