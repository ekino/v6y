import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
    test('login page renders the form', async ({ page }) => {
        await page.goto('/login');

        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('protected route redirects to login when unauthenticated', async ({ page }) => {
        await page.goto('/dashboard');

        await expect(page).toHaveURL(/\/login/);
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });
});

test.describe('Public routes', () => {
    test('faq page loads without authentication', async ({ page }) => {
        const response = await page.goto('/faq');

        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator('body')).not.toBeEmpty();
    });

    test('contact page loads without authentication', async ({ page }) => {
        const response = await page.goto('/contact');

        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator('body')).not.toBeEmpty();
    });
});
