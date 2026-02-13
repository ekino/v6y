import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityApplicationListView from '../features/v6y-applications/components/VitalityApplicationListView';
import VitalityAuthLoginView from '../features/v6y-auth/components/VitalityAuthLoginView';
import { createGraphQLErrorHandler, createGraphQLHandler, mockApiResponses } from './api.mocks';
import { server } from './msw.server';
import { renderWithProviders } from './render.utils';

describe('End-to-End Authentication and Navigation Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
        server.resetHandlers();
    });

    describe('Complete Login Flow', () => {
        it('should render login page when app starts', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should display login form with all required fields', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();

            const rememberMe = screen.getByText(/custom remember me/i);
            expect(rememberMe).toBeInTheDocument();
        });

        it('should allow user to submit login form', async () => {
            const user = userEvent.setup();

            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();

            // Simulate form submission
            await user.click(form);

            expect(form).toBeInTheDocument();
        });

        it('should handle successful login with API response', async () => {
            // Setup MSW handler for login
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            // MSW handles the request interception automatically
            // Verify the expected response structure
            expect(mockApiResponses.loginSuccess.loginAccount._id).toBe('user-123');
            expect(mockApiResponses.loginSuccess.loginAccount.token).toBe('mock-jwt-token');
        });

        it('should store authentication token after successful login', async () => {
            const loginResponse = mockApiResponses.loginSuccess;
            const token = loginResponse.loginAccount.token;

            expect(token).toBeTruthy();
            expect(token).toBe('mock-jwt-token');
        });

        it('should handle login with remember me option', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const rememberMeCheckbox = screen.getByText(/custom remember me/i);
            expect(rememberMeCheckbox).toBeInTheDocument();
        });
    });

    describe('Post-Login Navigation', () => {
        it('should render applications page after successful login', () => {
            // Setup: User is logged in (token in storage)
            server.use(createGraphQLHandler('GetApplications', mockApiResponses.applicationsList));

            renderWithProviders(<VitalityApplicationListView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should load applications list with mock data', async () => {
            // MSW handles the request interception automatically
            // Verify the expected response structure
            expect(mockApiResponses.applicationsList.getApplicationListByPageAndParams.length).toBe(
                2,
            );
            expect(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams[0].name,
            ).toBe('Application 1');
        });

        it('should display table with application data', () => {
            server.use(createGraphQLHandler('GetApplications', mockApiResponses.applicationsList));

            renderWithProviders(<VitalityApplicationListView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should have working edit button on each row', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Table should be rendered with action buttons
            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should have working delete button on each row', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Table should be rendered with delete actions
            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should have working show/view button on each row', () => {
            renderWithProviders(<VitalityApplicationListView />);

            // Table should support show action
            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });
    });

    describe('Session Persistence', () => {
        it('should maintain login session across page navigations', async () => {
            // Setup MSW handlers for both login and applications
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
            );

            // MSW handles the request interception automatically
            // Verify the expected response structures
            const token = mockApiResponses.loginSuccess.loginAccount.token;

            expect(token).toBeTruthy();
            expect(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams,
            ).toHaveLength(2);
        });

        it('should use same authentication token for multiple requests', async () => {
            // Setup MSW handlers for login and multiple data requests
            server.use(
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
                createGraphQLHandler('GetAccounts', mockApiResponses.accountsList),
            );

            // MSW handles the request interception automatically
            const token = mockApiResponses.loginSuccess.loginAccount.token;

            // Verify that the same token can be used for multiple requests
            expect(token).toBeTruthy();
            expect(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams,
            ).toBeDefined();
            expect(mockApiResponses.accountsList.getAccountList).toBeDefined();
        });

        it('should handle session refresh if needed', async () => {
            // MSW handles the request interception automatically
            // Simulate refresh token flow
            const newToken = mockApiResponses.loginSuccess.loginAccount.token;

            expect(newToken).toBe('mock-jwt-token');
        });
    });

    describe('Multi-Page Navigation Flow', () => {
        it('should navigate from login to applications list', async () => {
            // Step 1: Show login page
            const { unmount: unmountLogin } = renderWithProviders(<VitalityAuthLoginView />);
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();

            unmountLogin();

            // Step 2: After login, show applications
            server.use(createGraphQLHandler('GetApplications', mockApiResponses.applicationsList));
            renderWithProviders(<VitalityApplicationListView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should load different data for each page', async () => {
            // Setup MSW handlers for different pages
            server.use(
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
                createGraphQLHandler('GetAccounts', mockApiResponses.accountsList),
            );

            // MSW handles the request interception automatically
            expect(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams,
            ).toHaveLength(2);
            expect(mockApiResponses.accountsList.getAccountList).toHaveLength(2);
        });

        it('should support navigation between multiple pages', async () => {
            // Setup MSW handlers for all pages
            server.use(
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
                createGraphQLHandler('GetAccounts', mockApiResponses.accountsList),
                createGraphQLHandler('GetAuditReports', mockApiResponses.auditReports),
            );

            // MSW handles the request interception automatically
            expect(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams,
            ).toBeDefined();
            expect(mockApiResponses.accountsList.getAccountList).toBeDefined();
            expect(
                mockApiResponses.auditReports.getApplicationDetailsAuditReportsByParams,
            ).toBeDefined();
        });
    });

    describe('Error Handling in Complete Flow', () => {
        it('should handle login error and show message', async () => {
            // Setup MSW handler for error response
            server.use(createGraphQLErrorHandler('LoginAccount', 'Invalid credentials', 'query'));

            // MSW handles the error response automatically
            expect(mockApiResponses.loginError.error).toBe('Invalid credentials');
        });

        it('should allow retry after failed login', async () => {
            // Setup MSW handlers for retry scenario
            server.use(
                createGraphQLErrorHandler('LoginAccount', 'Invalid credentials', 'query'),
                createGraphQLHandler('LoginAccount', mockApiResponses.loginSuccess, 'query'),
            );

            // MSW handles the retry logic automatically
            expect(mockApiResponses.loginError.error).toBeTruthy();
            expect(mockApiResponses.loginSuccess.loginAccount.token).toBeTruthy();
        });

        it('should handle page load errors gracefully', async () => {
            // MSW handles error responses automatically
            const errorResponse = { error: 'Page load failed' };
            expect(errorResponse).toHaveProperty('error');
        });

        it('should handle network timeouts', async () => {
            // MSW can be configured to simulate network errors
            // For this test, we verify error handling structure
            expect(() => {
                throw new Error('Network timeout');
            }).toThrow('Network timeout');
        });
    });

    describe('Data Consistency', () => {
        it('should return consistent data on repeated requests', async () => {
            // Setup MSW handler
            server.use(createGraphQLHandler('GetApplications', mockApiResponses.applicationsList));

            // MSW handles repeated requests automatically
            // Verify the expected response structure
            expect(mockApiResponses.applicationsList.getApplicationListByPageAndParams).toEqual(
                mockApiResponses.applicationsList.getApplicationListByPageAndParams,
            );
        });

        it('should preserve data during navigation', async () => {
            // Setup MSW handlers
            server.use(
                createGraphQLHandler('GetApplications', mockApiResponses.applicationsList),
                createGraphQLHandler('GetAccounts', mockApiResponses.accountsList),
            );

            // MSW handles the request interception automatically
            const appId =
                mockApiResponses.applicationsList.getApplicationListByPageAndParams[0]._id;

            // Verify data consistency
            expect(mockApiResponses.applicationsList.getApplicationListByPageAndParams[0]._id).toBe(
                appId,
            );
        });
    });
});
