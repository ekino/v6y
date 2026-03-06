import { expect, test } from '@playwright/test';

interface LoginAccountResponse {
    data: {
        loginAccount: {
            _id: string;
            role: string;
            token: string;
        };
    };
}

const MOCK_LOGIN_RESPONSE: LoginAccountResponse = {
    data: {
        loginAccount: {
            _id: 'test-user-123',
            role: 'ADMIN',
            token: 'mock-jwt-token-abc123xyz',
        },
    },
};

const TEST_CREDENTIALS = {
    email: 'admin@v6y.local',
    password: 'testPassword123',
};

test('front-bo smoke: app loads and performs login with mocked GraphQL API', async ({ page }) => {
    const baseURL = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

    let loginApiRequest: Record<string, unknown> | null = null;

    // Mock GraphQL LoginAccount query
    await page.route('**/*', async (route) => {
        const request = route.request();

        try {
            if (request.method() === 'POST' && request.postDataBuffer()) {
                const postDataText = request.postDataBuffer().toString();

                if (postDataText.includes('LoginAccount')) {
                    loginApiRequest = JSON.parse(postDataText);

                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify(MOCK_LOGIN_RESPONSE),
                    });
                    return;
                }
            }
        } catch (error) {
            console.error('Error processing request:', error);
        }

        await route.continue();
    });

    const resp = await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    if (!resp || resp.status() >= 400) {
        throw new Error(`Failed to load ${baseURL} (status: ${resp?.status() ?? 'no response'})`);
    }

    // Fill login form
    const email = page.locator('input#email');
    await email.waitFor({ state: 'visible', timeout: 5000 });
    const emailCount = await email.count();

    if (emailCount === 0) {
        await page.screenshot({ path: 'debug-screenshot.png' });
        throw new Error('Email input not found on /login page');
    }

    await email.first().waitFor({ state: 'visible', timeout: 5000 });
    await email.first().fill(TEST_CREDENTIALS.email);

    const pass = page.locator('input[type="password"]');
    if ((await pass.count()) > 0) {
        await pass.waitFor({ state: 'visible', timeout: 5000 });
        await pass.fill(TEST_CREDENTIALS.password);
    }

    const submit = page.locator('button[type="submit"]');

    if ((await submit.count()) > 0) {
        await submit.first().waitFor({ state: 'visible', timeout: 5000 });

        const responsePromise = page
            .waitForResponse(
                (response) =>
                    response.url().includes('graphql') ||
                    response.request().postDataBuffer()?.toString().includes('LoginAccount'),
                { timeout: 10000 },
            )
            .catch(() => null);

        await submit.first().click();
        await responsePromise;

        // Wait for navigation away from /login route after successful authentication
        await page
            .waitForFunction(() => window.location.pathname !== '/login', { timeout: 10000 })
            .catch(() => null);
    }

    // Verify the login request was made with correct credentials
    expect(loginApiRequest).not.toBeNull();
    expect(loginApiRequest?.variables?.input?.email).toBe(TEST_CREDENTIALS.email);
    expect(loginApiRequest?.variables?.input?.password).toBe(TEST_CREDENTIALS.password);

    // Verify the user is logged in and dashboard is visible
    const mainContent = page
        .locator('main, [role="main"], .dashboard, [data-testid="dashboard"]')
        .first();
    await expect(mainContent).toBeVisible({ timeout: 5000 });
});
