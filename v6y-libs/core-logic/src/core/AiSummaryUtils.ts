export interface AiSummaryDependencyInput {
    type?: string | null;
    name?: string | null;
    version?: string | null;
}

export interface AiSummaryApplicationInput {
    name?: string | null;
    acronym?: string | null;
    description?: string | null;
    repo?: { organization?: string | null } | null;
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

// Cap on the number of bullet points requested from (and accepted back from) the model.
const MAX_SUMMARY_BULLETS = 4;

export const AI_SUMMARY_RESPONSE_FORMAT = {
    type: 'json_schema',
    json_schema: {
        name: 'ai_summary_response',
        strict: true,
        schema: {
            type: 'object',
            properties: {
                bullets: {
                    type: 'array',
                    items: { type: 'string' },
                },
                score: {
                    type: 'integer',
                },
            },
            required: ['bullets', 'score'],
            additionalProperties: false,
        },
    },
} as const;

const parseAiSummaryBullets = (content: string): string[] => {
    const trimmed = (content || '').trim();

    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && Array.isArray(parsed.bullets)) {
            const bullets = parsed.bullets
                .filter((bullet: unknown): bullet is string => typeof bullet === 'string')
                .map((bullet: string) => bullet.trim())
                .filter((bullet: string) => bullet.length > 0)
                .slice(0, MAX_SUMMARY_BULLETS);

            if (bullets.length > 0) {
                return bullets;
            }
        }
    } catch {
        // Not valid JSON: fall through to the plain-text fallback below.
    }

    return trimmed
        .split('\n')
        .map((line) => line.trim().replace(/^[-•]\s*/, ''))
        .filter((line) => line.length > 0)
        .slice(0, MAX_SUMMARY_BULLETS);
};

/**
 * Extracts the overall health score (0-10) from the same structured JSON
 * response parsed by parseAiSummaryBullets. Returns null when the content
 * isn't valid JSON or has no usable numeric score, rather than guessing.
 */
const parseAiSummaryScore = (content: string): number | null => {
    const trimmed = (content || '').trim();

    try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed?.score === 'number' && Number.isFinite(parsed.score)) {
            return Math.min(10, Math.max(0, Math.round(parsed.score)));
        }
    } catch {
        // Not valid JSON: no reliable score can be extracted from free-form text.
    }

    return null;
};

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
    const totalDependencyCount = techStack.reduce((total, stack) => total + stack.count, 0);

    const auditHealthLines = auditHealth
        .map(
            (audit) =>
                `- ${audit.category}: ${audit.score ?? 'n/a'}${audit.scoreUnit ? audit.scoreUnit : ''}` +
                (audit.scoreStatus ? ` (${audit.scoreStatus})` : ''),
        )
        .join('\n');

    const languageName = resolveLanguageName(language);

    const system = `You are a technical advisor writing for a non-expert, business-oriented audience (e.g. a product owner), based only on the application's name, description, tech stack and latest audit results provided below. Produce a short, plain-language summary of the application's current health. Avoid technical jargon and raw metric or tool names (e.g. say "the code is hard to maintain" rather than naming a specific metric or score). Most bullet points should simply describe the current state in accessible terms; include at most one or two next steps to prioritize, only when the audit health clearly shows a problem, and keep them short and non-technical. Respond in ${languageName}. Limit the answer to at most ${MAX_SUMMARY_BULLETS} short bullet points, each as one plain-text string with no markdown (no "**", "#", leading "-"/"•", etc.). The "Context" section below is the complete set of information available to you: treat it as exhaustive. Never state, imply or hedge that information, data or context is missing, incomplete or insufficient, and never ask for more details - if a particular aspect (e.g. audit results) has no data, simply omit it or note in one short bullet that it has not been evaluated yet, without apologizing. Do not invent information that is not present in the Context section. Also include an overall health "score" from 0 (critical) to 10 (excellent) that is consistent with the bullet points (e.g. do not describe a healthy application and then give it a low score, or vice versa). Respond with ONLY a single valid JSON object of the exact shape {"bullets": string[], "score": number} (${MAX_SUMMARY_BULLETS} bullets max, score between 0 and 10) - no surrounding text, no code fences, no extra keys.`;

    const applicationLine =
        `Application: ${application?.name || 'unknown'}` +
        (application?.acronym ? ` (${application.acronym})` : '') +
        (application?.repo?.organization
            ? ` - organization: ${application.repo.organization}`
            : '');

    const user =
        `Context:\n` +
        `${applicationLine}\n` +
        `Description: ${application?.description || 'n/a'}\n` +
        `Tech stack (${totalDependencyCount} total dependencies):\n${techStackLines || '- no dependency data available'}\n` +
        `Latest audit results:\n${auditHealthLines || '- no audit data available'}`;

    return { system, user };
};

const AiSummaryUtils = {
    buildTechStackSummary,
    buildAuditHealthSummary,
    buildAiSummaryPrompt,
    parseAiSummaryBullets,
    parseAiSummaryScore,
    AI_SUMMARY_RESPONSE_FORMAT,
};

export default AiSummaryUtils;
