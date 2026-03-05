import { expect, test } from '@playwright/test';

test('front-bo smoke: app loads and performs login with mocked GraphQL API', async ({ page }) => {
    const baseURL = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

    let loginApiRequest: Record<string, unknown> | null = null;

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
                        body: JSON.stringify({
                            data: {
                                loginAccount: {
                                    _id: 'test-user-123',
                                    role: 'ADMIN',
                                    token: 'mock-jwt-token-abc123xyz',
                                },
                            },
                        }),
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

    const email = page.locator('input#email');
    await email.waitFor({ state: 'visible', timeout: 5000 });
    const emailCount = await email.count();

    if (emailCount === 0) {
        await page.screenshot({ path: 'debug-screenshot.png' });
        throw new Error('Email input not found on page');
    }

    const testEmail = 'admin@v6y.local';
    const testPassword = 'testPassword123';

    await email.first().waitFor({ state: 'visible', timeout: 5000 });
    await email.first().fill(testEmail);

    const pass = page.locator('input[type="password"]');
    if ((await pass.count()) > 0) {
        await pass.waitFor({ state: 'visible', timeout: 5000 });
        await pass.fill(testPassword);
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

        await page
            .waitForFunction(() => window.location.pathname !== '/login', { timeout: 10000 })
            .catch(() => null);
    }

    expect(loginApiRequest).not.toBeNull();
    expect(loginApiRequest?.variables?.input?.email).toBe(testEmail);
    expect(loginApiRequest?.variables?.input?.password).toBe(testPassword);

    const mainContent = page
        .locator('main, [role="main"], .dashboard, [data-testid="dashboard"]')
        .first();
    await expect(mainContent).toBeVisible({ timeout: 5000 });
});
