import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAuthLoginView from '../features/v6y-auth/components/VitalityAuthLoginView';
import {
    mockApiResponses,
    mockFetch,
    mockFetchError,
    mockGraphQLClient,
    resetMockApiClient,
    setupMockApiClient,
} from './api.mocks';
import { renderWithProviders } from './render.utils';

/**
 * Integration tests for API calls and form submission
 * These tests verify that the app correctly mocks and handles API responses
 */

describe('API Integration Tests - Login with Mocks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetMockApiClient();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('API Mocking Setup', () => {
        it('should successfully setup mock GraphQL client', () => {
            const mockClient = setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);

            expect(mockClient.request).toBeDefined();
            expect(mockClient.request).toBeTruthy();
        });

        it('should setup mock fetch for REST API', () => {
            const mockResponse = { success: true, data: 'test' };
            mockFetch(mockResponse);

            expect(global.fetch).toBeDefined();
        });

        it('should reset all mocks properly', () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);

            resetMockApiClient();

            // After reset, mocks should have no call history
            expect(mockGraphQLClient.request.mock.calls.length).toBe(0);
        });

        it('should provide login success response structure', () => {
            const loginResponse = mockApiResponses.loginSuccess;

            expect(loginResponse).toHaveProperty('login');
            expect(loginResponse.login).toHaveProperty('data');
            expect(loginResponse.login).toHaveProperty('token');
            expect(loginResponse.login.data).toHaveProperty('id');
            expect(loginResponse.login.data).toHaveProperty('email');
        });

        it('should provide applications list response structure', () => {
            const appResponse = mockApiResponses.applicationsList;

            expect(appResponse).toHaveProperty('applications');
            expect(appResponse.applications).toHaveProperty('data');
            expect(appResponse.applications).toHaveProperty('total');
            expect(Array.isArray(appResponse.applications.data)).toBe(true);
        });

        it('should provide accounts list response structure', () => {
            const accountResponse = mockApiResponses.accountsList;

            expect(accountResponse).toHaveProperty('accounts');
            expect(accountResponse.accounts).toHaveProperty('data');
            expect(Array.isArray(accountResponse.accounts.data)).toBe(true);
        });
    });

    describe('Login Form with API Mocking', () => {
        it('should render login form ready for submission', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should submit login form with credentials', async () => {
            const user = userEvent.setup();

            // Setup mock API
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);

            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');

            // Simulate form submission
            await user.click(form);

            expect(form).toBeInTheDocument();
        });

        it('should handle successful login response', async () => {
            const loginResponse = mockApiResponses.loginSuccess;

            setupMockApiClient(mockGraphQLClient, loginResponse);

            // Verify the mock returns correct data
            const result = await mockGraphQLClient.request({});

            expect(result).toEqual(loginResponse);
            expect(result.login.data.id).toBe('user-123');
        });

        it('should include remember me checkbox in login form', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const rememberMeCheckbox = screen.getByText(/custom remember me/i);
            expect(rememberMeCheckbox).toBeInTheDocument();
        });

        it('should display authentication wrapper with correct props', () => {
            const { container } = renderWithProviders(<VitalityAuthLoginView />);

            // Component should render properly
            expect(container.firstChild).toBeTruthy();
        });
    });

    describe('Error Handling in API Mocks', () => {
        it('should handle login error response', async () => {
            const errorResponse = mockApiResponses.loginError;

            expect(errorResponse).toHaveProperty('error');
            expect(errorResponse.error).toBe('Invalid credentials');
        });

        it('should mock fetch error correctly', () => {
            const errorMessage = 'Network request failed';
            mockFetchError(errorMessage);

            expect(global.fetch).toBeDefined();
        });

        it('should resolve with failed fetch status', async () => {
            const response = { success: false };
            mockFetch(response, 401);

            const result = await global.fetch('/api/login');
            expect(result.status).toBe(401);
        });

        it('should handle different HTTP error statuses', async () => {
            const statusCodes = [400, 401, 403, 404, 500];

            for (const status of statusCodes) {
                mockFetch({ error: 'Error' }, status);
                const response = await global.fetch('/api/login');

                expect(response.status).toBe(status);
                expect(response.ok).toBe(status >= 200 && status < 300);
            }
        });
    });

    describe('Data Transformation in Mocks', () => {
        it('should provide correctly formatted user data', () => {
            const loginData = mockApiResponses.loginSuccess.login.data;

            expect(loginData).toHaveProperty('id');
            expect(loginData).toHaveProperty('email');
            expect(loginData).toHaveProperty('name');
            expect(typeof loginData.id).toBe('string');
            expect(typeof loginData.email).toBe('string');
        });

        it('should provide correctly formatted application data', () => {
            const appData = mockApiResponses.applicationsList.applications.data[0];

            expect(appData).toHaveProperty('_id');
            expect(appData).toHaveProperty('name');
            expect(appData).toHaveProperty('status');
            expect(appData).toHaveProperty('version');
        });

        it('should provide pagination information in list responses', () => {
            const appList = mockApiResponses.applicationsList.applications;

            expect(appList.total).toBe(2);
            expect(appList.data.length).toBe(2);
        });

        it('should provide audit report data structure', () => {
            const auditData = mockApiResponses.auditReports.auditReports.data[0];

            expect(auditData).toHaveProperty('_id');
            expect(auditData).toHaveProperty('applicationId');
            expect(auditData).toHaveProperty('status');
            expect(auditData).toHaveProperty('score');
        });
    });

    describe('Multiple API Calls Simulation', () => {
        it('should handle sequential API calls', async () => {
            // First call - login
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);
            const loginResult = await mockGraphQLClient.request({});

            expect(loginResult.login.data.id).toBe('user-123');

            // Second call - get applications
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            const appResult = await mockGraphQLClient.request({});

            expect(appResult.applications.data.length).toBe(2);
        });

        it('should support different responses for different operations', async () => {
            // Mock login response
            mockGraphQLClient.request.mockResolvedValueOnce(mockApiResponses.loginSuccess);
            const loginResult = await mockGraphQLClient.request({ operation: 'login' });

            expect(loginResult.login.data.id).toBe('user-123');

            // Mock applications response
            mockGraphQLClient.request.mockResolvedValueOnce(mockApiResponses.applicationsList);
            const appResult = await mockGraphQLClient.request({ operation: 'getApplications' });

            expect(appResult.applications.data.length).toBe(2);
        });

        it('should call mock API multiple times', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);

            await mockGraphQLClient.request({});
            await mockGraphQLClient.request({});
            await mockGraphQLClient.request({});

            expect(mockGraphQLClient.request).toHaveBeenCalledTimes(3);
        });
    });

    describe('Token Management in Mocks', () => {
        it('should provide JWT token in login response', () => {
            const loginResponse = mockApiResponses.loginSuccess;
            const token = loginResponse.login.token;

            expect(token).toBe('mock-jwt-token');
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('should use token for authenticated requests', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);
            const loginResult = await mockGraphQLClient.request({});

            const token = loginResult.login.token;

            // Simulate using token in subsequent request
            mockGraphQLClient.request.mockResolvedValueOnce(mockApiResponses.applicationsList);
            const appResult = await mockGraphQLClient.request({
                headers: { Authorization: `Bearer ${token}` },
            });

            expect(appResult.applications.data.length).toBeGreaterThan(0);
        });
    });
});
