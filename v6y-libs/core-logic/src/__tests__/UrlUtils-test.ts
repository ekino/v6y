import { describe, expect, it } from 'vitest';

import UrlUtils, { appendQueryParams, buildHttpUrl, joinUrlPath } from '../utils/UrlUtils.ts';

describe('UrlUtils', () => {
    describe('joinUrlPath', () => {
        it('joins segments with a single leading slash', () => {
            expect(joinUrlPath('api', 'static', 'auditor.json')).toBe('/api/static/auditor.json');
        });

        it('collapses duplicate slashes between a trailing-slash base and a leading-slash endpoint', () => {
            // Regression: base "/api/dynamic/" + "/auditor/start.json" must not yield "//".
            expect(joinUrlPath('/api/dynamic/', '/auditor/start-dynamic-auditor.json')).toBe(
                '/api/dynamic/auditor/start-dynamic-auditor.json',
            );
        });

        it('normalizes a base path with mixed leading/trailing slashes', () => {
            expect(joinUrlPath('v6y/bfb-main/', 'monitoring')).toBe('/v6y/bfb-main/monitoring');
        });

        it('ignores empty, null and undefined segments', () => {
            expect(joinUrlPath('/api', undefined, '', null, 'x')).toBe('/api/x');
        });

        it('returns "/" when no usable segment is provided', () => {
            expect(joinUrlPath()).toBe('/');
            expect(joinUrlPath(undefined, '', null)).toBe('/');
        });
    });

    describe('appendQueryParams', () => {
        it('appends params to a plain URL string', () => {
            expect(
                appendQueryParams('https://gitlab.com/api/v4/projects/1/merge_requests', {
                    created_after: '2026-01-01',
                    created_before: '2026-02-01',
                }),
            ).toBe(
                'https://gitlab.com/api/v4/projects/1/merge_requests?created_after=2026-01-01&created_before=2026-02-01',
            );
        });

        it('preserves an existing query string and adds to it', () => {
            expect(
                appendQueryParams(
                    'https://gitlab.com/api/v4/projects/1/deployments?status=success',
                    {
                        order_by: 'finished_at',
                        sort: 'desc',
                    },
                ),
            ).toBe(
                'https://gitlab.com/api/v4/projects/1/deployments?status=success&order_by=finished_at&sort=desc',
            );
        });

        it('skips undefined, null and empty-string values', () => {
            expect(
                appendQueryParams('https://example.com/x', {
                    a: '1',
                    b: undefined,
                    c: null,
                    d: '',
                }),
            ).toBe('https://example.com/x?a=1');
        });

        it('encodes special characters in values', () => {
            expect(
                appendQueryParams('https://sonar.example.com/api/measures/component', {
                    component: 'org:my-project',
                    metricKeys: 'bugs,vulnerabilities',
                }),
            ).toBe(
                'https://sonar.example.com/api/measures/component?component=org%3Amy-project&metricKeys=bugs%2Cvulnerabilities',
            );
        });

        it('accepts a URL instance', () => {
            const url = new URL('https://example.com/base');
            expect(appendQueryParams(url, { q: 'value' })).toBe('https://example.com/base?q=value');
        });
    });

    describe('buildHttpUrl', () => {
        it('builds a localhost URL from a base path and endpoint without a double slash', () => {
            expect(
                buildHttpUrl({
                    port: '4004',
                    path: ['/api/dynamic/', 'auditor/start-dynamic-auditor.json'],
                }),
            ).toBe('http://localhost:4004/api/dynamic/auditor/start-dynamic-auditor.json');
        });

        it('defaults protocol to http and hostname to localhost', () => {
            expect(buildHttpUrl({ port: '4002', path: '/health' })).toBe(
                'http://localhost:4002/health',
            );
        });

        it('omits the port when not provided', () => {
            expect(
                buildHttpUrl({ hostname: 'api.example.com', protocol: 'https', path: 'v1' }),
            ).toBe('https://api.example.com/v1');
        });

        it('accepts a trailing colon on the protocol', () => {
            expect(buildHttpUrl({ protocol: 'https:', hostname: 'example.com', path: '/x' })).toBe(
                'https://example.com/x',
            );
        });

        it('appends query params when provided', () => {
            expect(
                buildHttpUrl({
                    hostname: 'example.com',
                    path: '/search',
                    query: { q: 'test', page: 2 },
                }),
            ).toBe('http://example.com/search?q=test&page=2');
        });

        it('returns root pathname when no path segment is usable', () => {
            expect(buildHttpUrl({ hostname: 'example.com' })).toBe('http://example.com/');
        });
    });

    it('exposes the same functions on the default export', () => {
        expect(UrlUtils.joinUrlPath).toBe(joinUrlPath);
        expect(UrlUtils.appendQueryParams).toBe(appendQueryParams);
        expect(UrlUtils.buildHttpUrl).toBe(buildHttpUrl);
    });
});
