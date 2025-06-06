import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    // Navigate only if not already on the login page
    if (!this.page.url().includes('/parabank/index.htm')) {
      await this.page.goto('/parabank/index.htm');
      await this.page.waitForLoadState('networkidle');
    }
  }

  async login(username: string, password: string) {
    console.log(`Attempting login with username: ${username}, password: ${password}`);

    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);

    // Wait for navigation triggered by login click
   await Promise.all([
  this.page.click('input[value="Log In"]'),
  this.page.waitForURL(/.*parabank\/overview.*/),
]);
  }

  async retryLogin(username: string, password: string, maxAttempts = 5, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Login attempt ${attempt} for user: ${username}`);

      await this.goto();

      try {
        await this.login(username, password);
        await this.assertLoginSuccess();
        return; // Success
      } catch (err) {
        console.warn(`Login attempt ${attempt} failed.`);
        if (attempt === maxAttempts) throw err;
        await this.page.waitForTimeout(delayMs);
      }
    }
  }

  async assertLoginSuccess() {
    // Confirm both URL and page header to ensure login succeeded
    await expect(this.page).toHaveURL(/.*parabank\/overview/);
    const overviewHeader = this.page.locator('h1.title', { hasText: 'Accounts Overview' });
    await expect(overviewHeader).toBeVisible({ timeout: 3000 });
  }

  async assertLoginFailure() {
    const errorMessage = this.page.locator('p.error');
    await expect(errorMessage).toContainText('The username and password could not be verified', { timeout: 3000 });
  }

  async loginAndAssertSuccess(username: string, password: string) {
    await this.retryLogin(username, password);
  }

  async loginAndAssertFailure(username: string, password: string) {
    await this.goto();
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[value="Log In"]');
    await this.page.waitForTimeout(1000); // Wait for error message to appear
    await this.assertLoginFailure();
  }

  async assertLogoutSuccess() {
    // Check login input visible again after logout
    await expect(this.page.locator('input[name="username"]')).toBeVisible({ timeout: 3000 });
  }
}
