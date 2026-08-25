import AppLogger from '../core/AppLogger.ts';

// Matches the value documented in .env.template. A 'high' reasoning_effort
// completion of up to DEFAULT_MAX_TOKENS routinely takes well over 15s, so the
// default has to leave real head-room when LITELLM_TIMEOUT_MS is not set.
const DEFAULT_TIMEOUT_MS = 60000;
// High enough to leave room for actual output after 'high' reasoning_effort spends part of
// this same budget on internal reasoning tokens before producing visible content.
const DEFAULT_MAX_TOKENS = 4000;

export interface LiteLLMChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LiteLLMCompletionResult {
    content: string;
    model: string;
    tokensUsed: number | null;
}

export interface LiteLLMChatCompletionOptions {
    // Forwarded as-is as the OpenAI-compatible `response_format` field, letting
    // callers force a structured (JSON) completion instead of free-form text.
    responseFormat?: Record<string, unknown>;
}

/**
 * Thin client for a LiteLLM proxy (https://www.litellm.ai/), exposed behind
 * the OpenAI-compatible `/chat/completions` route. Routing through LiteLLM
 * (rather than a provider SDK) lets the actual model be swapped purely via
 * configuration (LITELLM_MODEL) - e.g. to the cheapest model still capable of
 * synthesizing technical metrics - without any code change here.
 */
const generateChatCompletion = async (
    messages: LiteLLMChatMessage[],
    options?: LiteLLMChatCompletionOptions,
): Promise<LiteLLMCompletionResult> => {
    const baseUrl = process.env.LITELLM_BASE_URL;
    const apiKey = process.env.LITELLM_API_KEY;
    const model = process.env.LITELLM_MODEL;
    // Only a valid, strictly-positive override wins; a missing, non-numeric,
    // negative or 0 value falls back to the default rather than aborting
    // instantly (0ms) or on NaN.
    const configuredTimeout = Number(process.env.LITELLM_TIMEOUT_MS);
    const timeoutMs =
        Number.isFinite(configuredTimeout) && configuredTimeout > 0
            ? configuredTimeout
            : DEFAULT_TIMEOUT_MS;

    if (!baseUrl?.length) {
        throw new Error('LITELLM_BASE_URL is not configured');
    }
    if (!apiKey?.length) {
        throw new Error('LITELLM_API_KEY is not configured');
    }
    if (!model?.length) {
        throw new Error('LITELLM_MODEL is not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: DEFAULT_MAX_TOKENS,
                // Max reasoning depth for reasoning-capable models ('high' is the top of the
                // OpenAI-compatible low/medium/high scale); ignored by non-reasoning models.
                reasoning_effort: 'high',
                ...(options?.responseFormat ? { response_format: options.responseFormat } : {}),
            }),
            signal: controller.signal,
        });

        const body = (await response.json().catch(() => null)) as {
            choices?: { message?: { content?: string } }[];
            model?: string;
            usage?: { total_tokens?: number };
            error?: { message?: string };
        } | null;

        if (!response.ok) {
            throw new Error(
                body?.error?.message || `LiteLLM request failed with HTTP ${response.status}`,
            );
        }

        const content = body?.choices?.[0]?.message?.content?.trim();
        if (!content) {
            throw new Error('LiteLLM returned an empty completion');
        }

        return {
            content,
            model: body?.model || model,
            tokensUsed: body?.usage?.total_tokens ?? null,
        };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            AppLogger.error('[LiteLLMApi - generateChatCompletion] timed out');
            throw new Error('LiteLLM request timed out', { cause: error });
        }
        AppLogger.error('[LiteLLMApi - generateChatCompletion] error: ', error);
        throw error;
    } finally {
        clearTimeout(timeout);
    }
};

const LiteLLMApi = {
    generateChatCompletion,
};

export default LiteLLMApi;
