import { test, expect } from "@playwright/test";

test.describe("Error pages", () => {
  test("should return 404 when visiting /", async ({ page }) => {
    await page.goto("/");
    const response = await page.waitForResponse(
      (response) => response.status() === 404
    );
    expect(response.ok()).toBeFalsy();
    await expect(page.locator("text=Not Found")).toBeVisible();
  });
});
