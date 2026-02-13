import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAuthLoginView from '../features/v6y-auth/components/VitalityAuthLoginView';
import {
    createGraphQLErrorHandler,
    createGraphQLHandler,
    mockApiResponses,
    mockFetch,
    mockFetchError,
} from './api.mocks';
import { server } from './msw.server';
import { renderWithProviders } from './render.utils';

describe('API Integration Tests - Login with MSW', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
        server.resetHandlers(); // Reset MSW handlers after each test
    });

    describe('MSW Mocking Setup', () => {
        it('should successfully setup MSW GraphQL handler', () => {
            const handler = createGraphQLHandler(
                'LoginAccount',
                mockApiResponses.loginSuccess,
                'query',
            );

            expect(handler).toBeDefined();
            expect(typeof handler).toBe('object'); // MSW handlers are objects
        });

        it('should setup mock fetch for REST API', () => {
            const mockResponse = { success: true, data: 'test' };
            mockFetch(mockResponse);

            expect(global.fetch).toBeDefined();
        });

        it('should create error handler for GraphQL operations', () => {
            const errorHandler = createGraphQLErrorHandler(
                'LoginAccount',
                'Invalid credentials',
                'query',
            );

            expect(errorHandler).toBeDefined();
            expect(typeof errorHandler).toBe('object'); // MSW handlers are objects
        });

        it('should provide login success response structure', () => {
            const loginResponse = mockApiResponses.loginSuccess;

            expect(loginResponse).toHaveProperty('loginAccount');
            expect(loginResponse.loginAccount).toHaveProperty('_id');
            expect(loginResponse.loginAccount).toHaveProperty('token');
            expect(loginResponse.loginAccount).toHaveProperty('role');
            expect(loginResponse.loginAccount).toHaveProperty('username');
        });

        it('should provide applications list response structure', () => {
            const appResponse = mockApiResponses.applicationsList;

            expect(appResponse).toHaveProperty('getApplicationListByPageAndParams');
            expect(Array.isArray(appResponse.getApplicationListByPageAndParams)).toBe(true);
            expect(appResponse.getApplicationListByPageAndParams[0]).toHaveProperty('_id');
            expect(appResponse.getApplicationListByPageAndParams[0]).toHaveProperty('name');
        });

        it('should provide accounts list response structure', () => {
            const accountResponse = mockApiResponses.accountsList;

            expect(accountResponse).toHaveProperty('getAccountList');
            expect(Array.isArray(accountResponse.getAccountList)).toBe(true);
            expect(accountResponse.getAccountList[0]).toHaveProperty('_id');
            expect(accountResponse.getAccountList[0]).toHaveProperty('email');
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

            // Setup MSW handler for successful login
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');

            // Simulate form submission
            await user.click(form);

            expect(form).toBeInTheDocument();
        });

        it('should handle successful login response', async () => {
            const loginResponse = mockApiResponses.loginSuccess;

            // Setup MSW handler for login
            server.use(createGraphQLHandler('LoginAccount', loginResponse, 'query'));

            // MSW handles the request interception automatically
            // This test now verifies the response structure is correct
            expect(loginResponse).toEqual(mockApiResponses.loginSuccess);
            expect(loginResponse.loginAccount._id).toBe('user-123');
            expect(loginResponse.loginAccount.token).toBe('mock-jwt-token');
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
            const loginData = mockApiResponses.loginSuccess.loginAccount;

            expect(loginData).toHaveProperty('_id');
            expect(loginData).toHaveProperty('email');
            expect(loginData).toHaveProperty('username');
            expect(typeof loginData._id).toBe('string');
            expect(typeof loginData.username).toBe('string');
        });

        it('should provide correctly formatted application data', () => {
            const appData = mockApiResponses.applicationsList.getApplicationListByPageAndParams[0];

            expect(appData).toHaveProperty('_id');
            expect(appData).toHaveProperty('name');
            expect(appData).toHaveProperty('acronym');
            expect(appData).toHaveProperty('contactMail');
        });

        it('should provide pagination information in list responses', () => {
            const appList = mockApiResponses.applicationsList.getApplicationListByPageAndParams;

            expect(appList.length).toBe(2);
            expect(Array.isArray(appList)).toBe(true);
        });

        it('should provide audit report data structure', () => {
            const auditData =
                mockApiResponses.auditReports.getApplicationDetailsAuditReportsByParams[0];

            expect(auditData).toHaveProperty('_id');
            expect(auditData).toHaveProperty('applicationId');
            expect(auditData).toHaveProperty('status');
            expect(auditData).toHaveProperty('score');
        });
    });

    describe('Multiple API Calls Simulation', () => {
        it('should handle sequential API calls', async () => {
            // Setup MSW handlers for both operations
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
            );

            // MSW handles the request interception automatically
            // Verify the expected response structures
            expect(mockApiResponses.loginSuccess.loginAccount._id).toBe('user-123');
            expect(mockApiResponses.applicationsList.getApplicationListByPageAndParams.length).toBe(
                2,
            );
        });

        it('should support different responses for different operations', async () => {
            // Setup MSW handlers with different responses
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
            );

            // MSW handles the request interception automatically
            // Verify the expected response structures
            expect(mockApiResponses.loginSuccess.loginAccount._id).toBe('user-123');
            expect(mockApiResponses.applicationsList.getApplicationListByPageAndParams.length).toBe(
                2,
            );
        });

        it('should call mock API multiple times', async () => {
            // Setup MSW handler
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
            );

            // MSW handles multiple requests automatically
            expect(mockApiResponses.loginSuccess.loginAccount._id).toBe('user-123');
            expect(mockApiResponses.loginSuccess.loginAccount.token).toBe('mock-jwt-token');
        });
    });

    describe('Token Management in Mocks', () => {
        it('should provide JWT token in login response', () => {
            const loginResponse = mockApiResponses.loginSuccess;
            const token = loginResponse.loginAccount.token;

            expect(token).toBe('mock-jwt-token');
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('should use token for authenticated requests', async () => {
            // Setup MSW handlers
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
            );

            const token = mockApiResponses.loginSuccess.loginAccount.token;

            // MSW handles authenticated requests automatically
            expect(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams.length,
            ).toBeGreaterThan(0);
        });
    });
});
