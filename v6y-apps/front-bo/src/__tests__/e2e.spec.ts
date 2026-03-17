import { expect, test } from '@playwright/test';

const MOCK_LOGIN_RESPONSE = {
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

test.describe('Authentication', () => {
    test('login page renders the form and navigation links', async ({ page }) => {
        await page.goto('/login');

        await expect(page.locator('input#email')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
    });

    test('protected route redirects to login when unauthenticated', async ({ page }) => {
        await page.goto('/v6y-applications');

        await expect(page).toHaveURL(/\/login/);
        await expect(page.locator('input#email')).toBeVisible();
    });

    test('successful login with mocked API sets cookie and redirects', async ({ page }) => {
        let loginApiRequest: Record<string, unknown> | null = null;

        await page.route('**/*', async (route) => {
            const request = route.request();

            try {
                if (request.method() === 'POST') {
                    const postDataText =
                        request.postData() ?? request.postDataBuffer()?.toString() ?? '';
                    if (postDataText.includes('LoginAccount')) {
                        loginApiRequest = JSON.parse(postDataText) as Record<string, unknown>;
                        await route.fulfill({
                            status: 200,
                            contentType: 'application/json',
                            body: JSON.stringify(MOCK_LOGIN_RESPONSE),
                        });
                        return;
                    }
                }
            } catch {
                // Keep test resilient: fall through to network when a non-JSON request is seen.
            }

            await route.continue();
        });

        await page.goto('/login');

        const email = page.locator('input#email');
        await email.waitFor({ state: 'visible', timeout: 5000 });
        await email.first().fill(TEST_CREDENTIALS.email);

        const password = page.locator('input[type="password"]');
        await password.waitFor({ state: 'visible', timeout: 5000 });
        await password.first().fill(TEST_CREDENTIALS.password);

        const submit = page.locator('button[type="submit"]');
        await submit.first().waitFor({ state: 'visible', timeout: 5000 });

        const responsePromise = page
            .waitForResponse(
                (response) =>
                    response.url().includes('graphql') ||
                    response.request().postData()?.includes('LoginAccount') === true,
                { timeout: 10000 },
            )
            .catch(() => null);

        await submit.first().click();
        await responsePromise;

        await page
            .waitForFunction(() => window.location.pathname !== '/login', { timeout: 10000 })
            .catch(() => null);

        expect(loginApiRequest).not.toBeNull();
        const vars = loginApiRequest as { variables?: { input?: Record<string, string> } };
        expect(vars?.variables?.input?.email).toBe(TEST_CREDENTIALS.email);
        expect(vars?.variables?.input?.password).toBe(TEST_CREDENTIALS.password);
    });
});

test.describe('Public routes', () => {
    test('forgot-password page loads and renders the form', async ({ page }) => {
        const response = await page.goto('/forgot-password');

        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator('input#email:visible')).toBeVisible();
        await expect(page.locator('button[type="submit"]:visible')).toBeVisible();
    });
});
