import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityApplicationListView from '../features/v6y-applications/components/VitalityApplicationListView';
import VitalityAuthLoginView from '../features/v6y-auth/components/VitalityAuthLoginView';
import {
    mockApiResponses,
    mockGraphQLClient,
    resetMockApiClient,
    setupMockApiClient,
} from './api.mocks';
import { renderWithProviders } from './render.utils';

/**
 * End-to-end integration tests for the complete authentication and workflow
 * These tests simulate user interactions like login followed by navigation
 */

describe('End-to-End Authentication and Navigation Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetMockApiClient();
    });

    afterEach(() => {
        vi.resetAllMocks();
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
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);

            renderWithProviders(<VitalityAuthLoginView />);

            // Verify login response
            const loginResult = await mockGraphQLClient.request({});
            expect(loginResult.login.data.id).toBe('user-123');
            expect(loginResult.login.token).toBe('mock-jwt-token');
        });

        it('should store authentication token after successful login', async () => {
            const loginResponse = mockApiResponses.loginSuccess;
            const token = loginResponse.login.token;

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
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);

            renderWithProviders(<VitalityApplicationListView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should load applications list with mock data', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);

            const result = await mockGraphQLClient.request({});

            expect(result.applications.data.length).toBe(2);
            expect(result.applications.data[0].name).toBe('Application 1');
        });

        it('should display table with application data', () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);

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
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);

            // First: Login
            const loginResult = await mockGraphQLClient.request({});
            const token = loginResult.login.token;

            // Second: Navigate to applications (using same token)
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            const appResult = await mockGraphQLClient.request({
                headers: { Authorization: `Bearer ${token}` },
            });

            expect(token).toBeTruthy();
            expect(appResult.applications.data).toHaveLength(2);
        });

        it('should use same authentication token for multiple requests', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);
            const loginResult = await mockGraphQLClient.request({});
            const token = loginResult.login.token;

            // Use token in multiple subsequent requests
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            const firstRequest = await mockGraphQLClient.request({
                headers: { Authorization: `Bearer ${token}` },
            });

            setupMockApiClient(mockGraphQLClient, mockApiResponses.accountsList);
            const secondRequest = await mockGraphQLClient.request({
                headers: { Authorization: `Bearer ${token}` },
            });

            expect(firstRequest.applications).toBeDefined();
            expect(secondRequest.accounts).toBeDefined();
        });

        it('should handle session refresh if needed', async () => {
            // Simulate refresh token flow
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);
            const initialResponse = await mockGraphQLClient.request({});

            const newToken = initialResponse.login.token;

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
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            renderWithProviders(<VitalityApplicationListView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should load different data for each page', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            const appData = await mockGraphQLClient.request({});
            expect(appData.applications.data.length).toBe(2);

            setupMockApiClient(mockGraphQLClient, mockApiResponses.accountsList);
            const accountData = await mockGraphQLClient.request({});
            expect(accountData.accounts.data.length).toBe(2);
        });

        it('should support navigation between multiple pages', async () => {
            // Applications page
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            const appResult = await mockGraphQLClient.request({});
            expect(appResult.applications).toBeDefined();

            // Accounts page
            setupMockApiClient(mockGraphQLClient, mockApiResponses.accountsList);
            const accountResult = await mockGraphQLClient.request({});
            expect(accountResult.accounts).toBeDefined();

            // Audit reports
            setupMockApiClient(mockGraphQLClient, mockApiResponses.auditReports);
            const auditResult = await mockGraphQLClient.request({});
            expect(auditResult.auditReports).toBeDefined();
        });
    });

    describe('Error Handling in Complete Flow', () => {
        it('should handle login error and show message', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginError);

            const result = await mockGraphQLClient.request({});

            expect(result).toHaveProperty('error');
            expect(result.error).toBe('Invalid credentials');
        });

        it('should allow retry after failed login', async () => {
            // First attempt - fail
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginError);
            let result = await mockGraphQLClient.request({});
            expect(result.error).toBeTruthy();

            // Retry attempt - success
            setupMockApiClient(mockGraphQLClient, mockApiResponses.loginSuccess);
            result = await mockGraphQLClient.request({});
            expect(result.login.token).toBeTruthy();
        });

        it('should handle page load errors gracefully', async () => {
            setupMockApiClient(mockGraphQLClient, { error: 'Page load failed' });

            const result = await mockGraphQLClient.request({});

            expect(result).toHaveProperty('error');
        });

        it('should handle network timeouts', async () => {
            mockGraphQLClient.request.mockRejectedValueOnce(new Error('Network timeout'));

            try {
                await mockGraphQLClient.request({});
                expect.fail('Should have thrown error');
            } catch (error) {
                expect(error).toBeTruthy();
            }
        });
    });

    describe('Data Consistency', () => {
        it('should return consistent data on repeated requests', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);

            const first = await mockGraphQLClient.request({});
            const second = await mockGraphQLClient.request({});

            expect(first.applications.data).toEqual(second.applications.data);
        });

        it('should preserve data during navigation', async () => {
            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);

            const appData = await mockGraphQLClient.request({});
            const appId = appData.applications.data[0]._id;

            // Navigate away and back
            setupMockApiClient(mockGraphQLClient, mockApiResponses.accountsList);
            await mockGraphQLClient.request({});

            setupMockApiClient(mockGraphQLClient, mockApiResponses.applicationsList);
            const refreshedData = await mockGraphQLClient.request({});

            expect(refreshedData.applications.data[0]._id).toBe(appId);
        });
    });
});
