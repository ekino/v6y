import { expect, test } from '@playwright/test';

test('front smoke: app loads and optionally performs login', async ({ page }) => {
    const baseURL = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

    const resp = await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (!resp || resp.status() >= 400) {
        throw new Error(`Failed to load ${baseURL} (status: ${resp?.status() ?? 'no response'})`);
    }

    const email = page.locator('input[type="email"]');
    if ((await email.count()) > 0) {
        await email.fill('test@example.com');
        const pass = page.locator('input[type="password"]');
        if ((await pass.count()) > 0) await pass.fill('password');
        const submit = page.locator('button[type="submit"]');
        if ((await submit.count()) > 0) {
            await submit
                .first()
                .click()
                .catch(() => {});
            await Promise.race([
                page.waitForURL(/dashboard|\/app|\/home/i, { timeout: 5000 }).catch(() => null),
                page.waitForSelector('text=Dashboard', { timeout: 5000 }).catch(() => null),
            ]);
        }
    }

    await expect(page.locator('body')).not.toBeEmpty();
});
