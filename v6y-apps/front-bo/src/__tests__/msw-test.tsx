import { describe, expect, it } from 'vitest';

import { createGraphQLHandler, mockApiResponses } from './api.mocks';
import { server } from './msw.server';

/**
 * Test MSW setup and handlers
 */
describe('MSW Setup', () => {
    it('should have MSW server configured', () => {
        expect(server).toBeDefined();
        expect(typeof server.listen).toBe('function');
        expect(typeof server.close).toBe('function');
    });

    it('should create GraphQL handlers', () => {
        const handler = createGraphQLHandler(
            'LoginAccount',
            mockApiResponses.loginSuccess,
            'query',
        );
        expect(handler).toBeDefined();
        expect(typeof handler).toBe('object'); // MSW handlers are objects
        expect(handler).toHaveProperty('resolver');
    });

    it('should have correct mock response structure', () => {
        expect(mockApiResponses.loginSuccess).toHaveProperty('loginAccount');
        expect(mockApiResponses.loginSuccess.loginAccount).toHaveProperty('token');
        expect(mockApiResponses.applicationsList).toHaveProperty(
            'getApplicationListByPageAndParams',
        );
        expect(
            Array.isArray(mockApiResponses.applicationsList.getApplicationListByPageAndParams),
        ).toBe(true);
    });
});
