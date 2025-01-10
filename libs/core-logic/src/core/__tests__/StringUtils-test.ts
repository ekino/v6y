// StringUtils.test.ts
import { describe, expect, it, vi } from 'vitest';

import StringUtils from '../StringUtils.ts';

// Mock AppLogger
vi.mock('./AppLogger', async () => {
    return {
        AppLogger: {
            info: vi.fn(),
        },
    };
});

describe('StringUtils', () => {
    describe('encodeBase64', () => {
        it('should encode a string to base64', () => {
            const result = StringUtils.encodeBase64('test');
            expect(result).toBe('dGVzdA==');
        });

        it('should handle empty strings', () => {
            const result = StringUtils.encodeBase64('');
            expect(result).toBe('');
        });
    });

    describe('decodeBase64', () => {
        it('should decode a base64 string', () => {
            const result = StringUtils.decodeBase64('dGVzdA==');
            expect(result).toBe('test');
        });

        it('should handle empty strings', () => {
            const result = StringUtils.decodeBase64('');
            expect(result).toBe('');
        });
    });

    describe('parseJsonString', () => {
        it('should parse a valid JSON string', () => {
            const result = StringUtils.parseJsonString('{"test": "value"}');
            expect(result).toEqual({ test: 'value' });
        });

        it('should return null for invalid JSON strings', () => {
            const result = StringUtils.parseJsonString('invalid json');
            expect(result).toBeNull();
        });
    });

    describe('parseEncodedJsonString', () => {
        it('should parse an encoded JSON string', () => {
            const result = StringUtils.parseEncodedJsonString('eyJ0ZXN0IjoidmFsdWUifQ=='); // base64 encoded '{"test": "value"}'
            expect(result).toEqual({ test: 'value' });
        });

        it('should return null for invalid encoded JSON strings', () => {
            const result = StringUtils.parseEncodedJsonString('invalid json');
            expect(result).toBeNull();
        });
    });
});
