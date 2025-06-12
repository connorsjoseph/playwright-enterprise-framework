import { Page, expect } from '@playwright/test';
export async function logoutAndLogin(page: Page, username: string, password: string): Promise<void> {
  // If already logged in, logout
  //if (await page.locator('a[href*="logout"]').isVisible()) {
    const logoutLink = page.locator("text=Log Out");
    await expect(logoutLink).toBeVisible({ timeout: 3000 });
    await logoutLink.click();
   // await page.click('a[href*="logout"]');
    //await expect(page.locator('a[href*="login"]')).toBeVisible();
  

  // Ensure login form is loaded
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('input[value="Log In"]');

  // ✅ Wait for account overview page
  await expect(page).toHaveURL(/.*overview/);
}
