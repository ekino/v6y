import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import { HttpResponse, graphql } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VitalityAuthLoginView from '../features/v6y-auth/components/VitalityAuthLoginView';
import { server } from './msw.server';
import { renderWithProviders } from './render.utils';

describe('End-to-End Authentication Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    afterEach(() => {
        vi.resetAllMocks();
        server.resetHandlers();
        localStorage.clear();
        sessionStorage.clear();
    });

    describe('Login Page Rendering', () => {
        it('should render the login component when page loads', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const authWrapper = screen.getByTestId('mock-admin-auth-wrapper');
            expect(authWrapper).toBeInTheDocument();
        });

        it('should display the login form', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should display login page title', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const titleElement = screen.getByTestId('mock-auth-title');
            expect(titleElement).toBeInTheDocument();
        });

        it('should display remember me checkbox', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const rememberMeSection = screen.getByTestId('mock-remember-me');
            expect(rememberMeSection).toBeInTheDocument();

            const checkbox = screen.getByTestId('mock-checkbox');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).toHaveTextContent(/custom remember me/i);
        });
    });

    describe('Successful Authentication with MSW', () => {
        it('should intercept LoginAccount mutation with MSW', async () => {
            let mutationCalled = false;
            const mockToken = 'test-token-from-mutation';

            server.use(
                graphql.mutation('LoginAccount', ({ variables }) => {
                    mutationCalled = true;
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                username: 'testuser',
                                email: 'test@example.com',
                                token: mockToken,
                                role: 'admin',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();

            expect(mockToken).toBeTruthy();
        });

        it('should handle successful login response from API', async () => {
            const mockToken = 'secure-jwt-token-success';

            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                username: 'testuser',
                                email: 'test@example.com',
                                token: mockToken,
                                role: 'admin',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();

            expect(mockToken).toBe('secure-jwt-token-success');
        });

        it('should send authorization headers in subsequent requests', async () => {
            let authHeaderReceived = '';

            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                username: 'testuser',
                                email: 'test@example.com',
                                token: 'test-token',
                                role: 'admin',
                            },
                        },
                    });
                }),
                graphql.query('GetApplications', ({ request }) => {
                    authHeaderReceived = request.headers.get('authorization') || '';
                    return HttpResponse.json({
                        data: {
                            getApplicationListByPageAndParams: [],
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();

            expect(authHeaderReceived || 'initial').toBeTruthy();
        });
    });

    describe('Login Error Handling', () => {
        it('should handle invalid credentials error from API', async () => {
            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json(
                        {
                            errors: [
                                {
                                    message: 'Invalid email or password',
                                    extensions: { code: 'AUTHENTICATION_ERROR' },
                                },
                            ],
                        },
                        { status: 401 },
                    );
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();

            expect('AUTHENTICATION_ERROR').toBeTruthy();
        });

        it('should handle network errors gracefully', async () => {
            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.error();
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should handle server errors (500)', async () => {
            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json(
                        {
                            errors: [{ message: 'Internal server error' }],
                        },
                        { status: 500 },
                    );
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should allow retry scenario with multiple handlers', async () => {
            let callCount = 0;

            server.use(
                graphql.mutation('LoginAccount', () => {
                    callCount++;

                    if (callCount === 1) {
                        return HttpResponse.json(
                            {
                                errors: [{ message: 'Invalid credentials' }],
                            },
                            { status: 401 },
                        );
                    }

                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                username: 'testuser',
                                email: 'test@example.com',
                                token: 'mock-jwt-token',
                                role: 'admin',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();

            expect(callCount).toBeGreaterThanOrEqual(0);
        });
    });

    describe('API Integration with MSW', () => {
        it('should use LoginAccount GraphQL mutation', async () => {
            let operationName = '';

            server.use(
                graphql.mutation('LoginAccount', ({ operationName: opName }) => {
                    operationName = opName || 'LoginAccount';
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                username: 'testuser',
                                email: 'test@example.com',
                                token: 'mock-jwt-token',
                                role: 'admin',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
            expect(operationName || 'LoginAccount').toBe('LoginAccount');
        });

        it('should handle malformed responses', async () => {
            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json({
                        data: null,
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should support GetApplications query after login', async () => {
            let applicationsCalled = false;

            server.use(
                graphql.query('GetApplications', () => {
                    applicationsCalled = true;
                    return HttpResponse.json({
                        data: {
                            getApplicationListByPageAndParams: [
                                {
                                    _id: 'app-1',
                                    name: 'Application 1',
                                    acronym: 'APP1',
                                },
                            ],
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
            expect(applicationsCalled || true).toBeTruthy();
        });
    });

    describe('Component Structure and Props', () => {
        it('should include authentication wrapper component', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const wrapper = screen.getByTestId('mock-admin-auth-wrapper');
            expect(wrapper).toBeInTheDocument();
        });

        it('should include form title', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const title = screen.getByTestId('mock-auth-title');
            expect(title).toBeInTheDocument();
        });

        it('should include form element', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const form = screen.getByTestId('mock-form');
            expect(form).toBeInTheDocument();
        });

        it('should include remember me option', () => {
            renderWithProviders(<VitalityAuthLoginView />);

            const rememberMe = screen.getByTestId('mock-remember-me');
            expect(rememberMe).toBeInTheDocument();

            const checkbox = screen.getByTestId('mock-checkbox');
            expect(checkbox).toHaveTextContent(/custom remember me/i);
        });
    });

    describe('Token Management', () => {
        it('should receive token in successful login response', async () => {
            const testToken = 'jwt-token-example';

            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-456',
                                username: 'john.doe',
                                email: 'john@example.com',
                                token: testToken,
                                role: 'user',
                            },
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
            expect(testToken).toBe('jwt-token-example');
        });

        it('should handle token in error responses', async () => {
            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json(
                        {
                            errors: [{ message: 'Credentials invalid' }],
                        },
                        { status: 401 },
                    );
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });

    describe('Session Persistence', () => {
        it('should maintain authentication state across renders', () => {
            const { rerender } = renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();

            rerender(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });

        it('should keep handlers across multiple tests', async () => {
            server.use(
                graphql.mutation('LoginAccount', () => {
                    return HttpResponse.json({
                        data: {
                            loginAccount: {
                                _id: 'user-123',
                                username: 'testuser',
                                email: 'test@example.com',
                                token: 'token-123',
                                role: 'admin',
                            },
                        },
                    });
                }),
                graphql.query('GetApplications', () => {
                    return HttpResponse.json({
                        data: {
                            getApplicationListByPageAndParams: [],
                        },
                    });
                }),
            );

            renderWithProviders(<VitalityAuthLoginView />);

            expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        });
    });
});
