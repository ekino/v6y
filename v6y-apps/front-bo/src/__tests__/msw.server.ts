import { setupServer } from 'msw/node';

import { handlers } from './msw.handlers';

export const server = setupServer(...handlers);

beforeAll(() => {
    server.listen({
        onUnhandledRequest: 'warn', // Warn about unhandled requests instead of erroring
    });
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});
