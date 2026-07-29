import AppLogger from '../core/AppLogger.ts';

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_MAX_TOKENS = 400;

export interface LiteLLMChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LiteLLMCompletionResult {
    content: string;
    model: string;
    tokensUsed: number | null;
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
): Promise<LiteLLMCompletionResult> => {
    const baseUrl = process.env.LITELLM_BASE_URL;
    const apiKey = process.env.LITELLM_API_KEY;
    const model = process.env.LITELLM_MODEL;
    const timeoutMs = Number(process.env.LITELLM_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;

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
                temperature: 0.2,
                max_tokens: DEFAULT_MAX_TOKENS,
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
