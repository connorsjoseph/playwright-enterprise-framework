import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/parabank/index.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string) {
    console.log(`Attempting login with username: ${username}, password: ${password}`);
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[value="Log In"]');
  }

  async retryLogin(username: string, password: string, maxAttempts = 5, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Login attempt ${attempt} for user: ${username}`);
      await this.goto();
      await this.login(username, password);
      try {
        await this.assertLoginSuccess();
        return; // Success
      } catch (err) {
        if (attempt === maxAttempts) throw err;
        await this.page.waitForTimeout(delayMs);
      }
    }
  }

  async assertLoginSuccess() {
    const overviewHeader = this.page.locator('h1.title', { hasText: 'Accounts Overview' });
    await expect(overviewHeader).toBeVisible();
  }

  async assertLoginFailure() {
    const errorMessage = this.page.locator('p.error');
    await expect(errorMessage).toContainText('The username and password could not be verified');
  }

  async loginAndAssertSuccess(username: string, password: string) {
    await this.retryLogin(username, password);
  }

  async loginAndAssertFailure(username: string, password: string) {
    await this.goto();
    await this.login(username, password);
    await this.assertLoginFailure();
  }
  async assertLogoutSuccess() {
  await expect(this.page.locator('input[name="username"]')).toBeVisible({ timeout: 3000 });
}

}
