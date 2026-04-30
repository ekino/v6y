import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SonarQubeAuditorManager from '../auditors/SonarQubeAuditorManager.ts';

const VALID_URL = 'https://sonar.example.com/dashboard?id=my-project';
const BASE_URL = 'https://sonar.example.com';
const PROJECT_KEY = 'my-project';

const makeFetchResponse = (ok: boolean, body: unknown, status = ok ? 200 : 401) =>
    Promise.resolve({
        ok,
        status,
        statusText: ok ? 'OK' : 'Unauthorized',
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(String(body)),
    });

const mockMeasuresData = {
    component: {
        measures: [
            { metric: 'coverage', value: '82.5' },
            { metric: 'bugs', value: '3' },
            { metric: 'reliability_rating', value: '2' },
        ],
    },
};

const mockQgData = {
    projectStatus: { status: 'OK' },
};

describe('SonarQubeAuditorManager - getSonarQubeMetrics', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns error when sonarUrl has an invalid format', async () => {
        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: 'not-a-url',
        });

        expect(result.success).toBe(false);
        expect(result.error).toMatch(/Invalid SonarQube URL format/);
    });

    it('returns error when sonarUrl has no project key param', async () => {
        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: 'https://sonar.example.com/dashboard',
        });

        expect(result.success).toBe(false);
        expect(result.error).toMatch(/Could not extract project key/);
    });

    it('returns error when measures API call fails', async () => {
        vi.mocked(fetch).mockResolvedValue(makeFetchResponse(false, 'Unauthorized') as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
        });

        expect(result.success).toBe(false);
        expect(result.error).toMatch(/SonarQube API returned 401/);
        expect(result.error).toMatch(/project may be private/);
    });

    it('includes token check hint in error when token is provided', async () => {
        vi.mocked(fetch).mockResolvedValue(makeFetchResponse(false, 'Forbidden', 403) as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
            token: 'my-token',
        });

        expect(result.success).toBe(false);
        expect(result.error).toMatch(/check token permissions/);
    });

    it('returns formatted metrics on success without token', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(true, mockQgData) as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
        });

        expect(result.success).toBe(true);
        expect(result.projectKey).toBe(PROJECT_KEY);
        expect(result.baseUrl).toBe(BASE_URL);
        expect(result.qualityGate).toEqual({ status: 'OK', name: 'Sonar Way' });
        expect(result.metrics).toHaveLength(3);
    });

    it('converts numeric rating values to letter grades', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(true, mockQgData) as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
        });

        const reliabilityMetric = result.metrics?.find((m) => m.key === 'reliability_rating');
        expect(reliabilityMetric?.value).toBe('B');
        expect(reliabilityMetric?.rating).toBe('B');
    });

    it('does not set rating field for non-rating metrics', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(true, mockQgData) as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
        });

        const coverageMetric = result.metrics?.find((m) => m.key === 'coverage');
        expect(coverageMetric?.value).toBe('82.5');
        expect(coverageMetric?.rating).toBeNull();
    });

    it('sets Authorization header when token is provided', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(true, mockQgData) as never);

        await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
            token: 'secret-token',
        });

        const [measuresCall] = vi.mocked(fetch).mock.calls;
        const headers = measuresCall[1]?.headers as Record<string, string>;
        expect(headers['Authorization']).toBe('Bearer secret-token');
    });

    it('does not set Authorization header when token is absent', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(true, mockQgData) as never);

        await SonarQubeAuditorManager.getSonarQubeMetrics({ sonarUrl: VALID_URL });

        const [measuresCall] = vi.mocked(fetch).mock.calls;
        const headers = measuresCall[1]?.headers as Record<string, string>;
        expect(headers['Authorization']).toBeUndefined();
    });

    it('returns success with null qualityGate when quality gate API fails', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(false, 'error', 500) as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
        });

        expect(result.success).toBe(true);
        expect(result.qualityGate).toBeNull();
    });

    it('supports ?project= param as project key', async () => {
        vi.mocked(fetch)
            .mockResolvedValueOnce(makeFetchResponse(true, mockMeasuresData) as never)
            .mockResolvedValueOnce(makeFetchResponse(true, mockQgData) as never);

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: 'https://sonar.example.com/dashboard?project=other-key',
        });

        expect(result.success).toBe(true);
        expect(result.projectKey).toBe('other-key');
    });

    it('returns error on unexpected exception', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Network failure'));

        const result = await SonarQubeAuditorManager.getSonarQubeMetrics({
            sonarUrl: VALID_URL,
        });

        expect(result.success).toBe(false);
        expect(result.error).toMatch(/Network failure/);
    });
});
