import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LiteLLMApi from '../apis/LiteLLMApi.ts';

vi.mock('../core/AppLogger.ts', () => ({
    default: { info: vi.fn(), error: vi.fn() },
}));

const ENV_KEYS = [
    'LITELLM_BASE_URL',
    'LITELLM_API_KEY',
    'LITELLM_MODEL',
    'LITELLM_TIMEOUT_MS',
] as const;

describe('LiteLLMApi', () => {
    const originalEnv: Record<string, string | undefined> = {};

    beforeEach(() => {
        ENV_KEYS.forEach((key) => {
            originalEnv[key] = process.env[key];
        });
        process.env.LITELLM_BASE_URL = 'http://localhost:4000';
        process.env.LITELLM_API_KEY = 'test-key';
        process.env.LITELLM_MODEL = 'gpt-4o-mini';
        delete process.env.LITELLM_TIMEOUT_MS;
    });

    afterEach(() => {
        ENV_KEYS.forEach((key) => {
            if (originalEnv[key] === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = originalEnv[key];
            }
        });
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it('throws a descriptive error when LITELLM_BASE_URL is missing', async () => {
        delete process.env.LITELLM_BASE_URL;

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow(
            'LITELLM_BASE_URL is not configured',
        );
    });

    it('throws a descriptive error when LITELLM_API_KEY is missing', async () => {
        delete process.env.LITELLM_API_KEY;

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow(
            'LITELLM_API_KEY is not configured',
        );
    });

    it('throws a descriptive error when LITELLM_MODEL is missing', async () => {
        delete process.env.LITELLM_MODEL;

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow(
            'LITELLM_MODEL is not configured',
        );
    });

    it('calls the chat/completions endpoint with the configured model and returns the content', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                model: 'gpt-4o-mini',
                choices: [{ message: { content: '  Synthesis text  ' } }],
                usage: { total_tokens: 123 },
            }),
        });
        vi.stubGlobal('fetch', fetchMock);

        const result = await LiteLLMApi.generateChatCompletion([
            { role: 'system', content: 'sys' },
            { role: 'user', content: 'usr' },
        ]);

        expect(fetchMock).toHaveBeenCalledWith(
            'http://localhost:4000/chat/completions',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
            }),
        );
        expect(result).toEqual({
            content: 'Synthesis text',
            model: 'gpt-4o-mini',
            tokensUsed: 123,
        });
    });

    it('forwards a responseFormat option as the OpenAI-compatible response_format field', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                model: 'gpt-4o-mini',
                choices: [{ message: { content: '{"bullets":["Point"]}' } }],
                usage: { total_tokens: 42 },
            }),
        });
        vi.stubGlobal('fetch', fetchMock);

        const responseFormat = { type: 'json_schema', json_schema: { name: 'test' } };
        await LiteLLMApi.generateChatCompletion([{ role: 'user', content: 'usr' }], {
            responseFormat,
        });

        const [, requestInit] = fetchMock.mock.calls[0];
        const body = JSON.parse(requestInit.body as string);
        expect(body.response_format).toEqual(responseFormat);
    });

    it('throws when the provider responds with a non-ok HTTP status', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 429,
                json: async () => ({ error: { message: 'Rate limit exceeded' } }),
            }),
        );

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow('Rate limit exceeded');
    });

    it('throws a generic error when the response body cannot be parsed and no message is available', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => {
                    throw new Error('invalid json');
                },
            }),
        );

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow(
            'LiteLLM request failed with HTTP 500',
        );
    });

    it('throws when the completion content is empty', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ choices: [{ message: { content: '' } }] }),
            }),
        );

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow(
            'LiteLLM returned an empty completion',
        );
    });

    it('converts an abort (timeout) into a friendly error message', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation(() => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                return Promise.reject(error);
            }),
        );

        await expect(LiteLLMApi.generateChatCompletion([])).rejects.toThrow(
            'LiteLLM request timed out',
        );
    });
});
