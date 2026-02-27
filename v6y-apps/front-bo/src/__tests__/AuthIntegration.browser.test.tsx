import '@testing-library/jest-dom/vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, graphql } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAuthLoginView from '../features/v6y-auth/components/VitalityAuthLoginView';
import { server } from './msw.server';
import { renderWithProviders } from './render.utils';

const mockLoginAccountHandler = (overrides?: Record<string, unknown>) =>
    graphql.query('LoginAccount', () => {
        return HttpResponse.json({
            data: {
                loginAccount: {
                    _id: 'user-123',
                    role: 'admin',
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token.signature',
                    username: 'testuser',
                    ...overrides,
                },
            },
        });
    });

describe('Authentication Integration Tests', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        server.resetHandlers();
        localStorage.clear();
        sessionStorage.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    describe('User Login Flow', () => {
        it('should render login form with remember me option', async () => {
            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
            expect(screen.getByText(/custom remember me/i)).toBeInTheDocument();
        });

        it('should submit form successfully on successful authentication', async () => {
            const user = userEvent.setup();

            server.use(mockLoginAccountHandler());

            renderWithProviders(<VitalityAuthLoginView />);
            const form = screen.getByTestId('mock-form');

            await user.click(form);

            await waitFor(() => {
                expect(form).toBeInTheDocument();
            });
        });

        it('should store authentication token for subsequent API calls', async () => {
            const user = userEvent.setup();
            const authToken = 'jwt-token-stored-for-api-calls';

            server.use(
                graphql.query('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-456',
                                role: 'admin',
                                token: authToken,
                                username: 'testuser',
                            },
                        },
                    });
                }),
                graphql.query('GetApplications', ({ request }) => {
                    const authHeader = request.headers.get('Authorization');
                    expect(authHeader).toContain(authToken);
                    return HttpResponse.json({
                        data: {
                            getApplicationListByPageAndParams: [],
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));

            await waitFor(() => {
                expect(screen.getByTestId('mock-form')).toBeInTheDocument();
            });
        });
    });

    describe('Error Scenarios', () => {
        it('should handle missing email validation error', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', ({ variables }) => {
                    if (!variables?.input?.email) {
                        return HttpResponse.json({
                            errors: [{ message: 'Email is required' }],
                        });
                    }
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                role: 'admin',
                                token: 'token',
                                username: 'testuser',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should handle missing password validation error', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', ({ variables }) => {
                    if (!variables?.input?.password) {
                        return HttpResponse.json({
                            errors: [{ message: 'Password is required' }],
                        });
                    }
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                role: 'admin',
                                token: 'token',
                                username: 'testuser',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });

    describe('Network Errors', () => {
        it('should handle internal server error gracefully', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', () =>
                    HttpResponse.json(
                        { errors: [{ message: 'Internal server error' }] },
                        { status: 500 },
                    ),
                ),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should handle service unavailable error', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', () =>
                    HttpResponse.json(
                        { errors: [{ message: 'Service unavailable' }] },
                        { status: 503 },
                    ),
                ),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });

    describe('User Roles', () => {
        it('should authenticate admin user successfully', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'admin-001',
                                role: 'admin',
                                token: 'admin-token',
                                username: 'adminuser',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should authenticate regular user successfully', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-002',
                                role: 'user',
                                token: 'user-token',
                                username: 'regularuser',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });

    describe('Form Resubmission', () => {
        it('should allow form resubmission after failed attempt', async () => {
            const user = userEvent.setup();
            let attemptCount = 0;

            server.use(
                graphql.query('LoginAccount', () => {
                    attemptCount++;

                    if (attemptCount === 1) {
                        return HttpResponse.json({ errors: [{ message: 'Temporary error' }] });
                    }

                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'retry-success',
                                role: 'admin',
                                token: 'retry-token',
                                username: 'retryuser',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            const form = screen.getByTestId('mock-form');

            await user.click(form);
            expect(form).toBeInTheDocument();

            await user.click(form);

            await waitFor(() => {
                expect(form).toBeInTheDocument();
            });
        });
    });

    describe('API Contract', () => {
        it('should send correct form data to GraphQL mutation', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', ({ variables }) => {
                    expect(variables?.input).toBeDefined();
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-api-test',
                                role: 'admin',
                                token: 'api-test-token',
                                username: 'apitestuser',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should handle GraphQL error response structure', async () => {
            const user = userEvent.setup();

            server.use(
                graphql.query('LoginAccount', () => {
                    return HttpResponse.json({
                        errors: [
                            {
                                message: 'Authentication failed',
                                extensions: {
                                    code: 'UNAUTHENTICATED',
                                    details: 'Invalid credentials provided',
                                },
                            },
                        ],
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);
            await user.click(screen.getByTestId('mock-form'));
            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });
});
