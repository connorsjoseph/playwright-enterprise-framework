import { Page, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { LoginPage } from '../pages/login.page';

export async function registerAndLogin(page: Page, user: {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
}) {
  const registerPage = new RegisterPage(page);
  await registerPage.registerAndAssertSuccess(user);

  // Wait for welcome message to ensure persistence
  await expect(page.locator(`text=Welcome ${user.username}`)).toBeVisible({ timeout: 5000 });

  await registerPage.logout();

  // Ensure we are on the login page before attempting login
  if (!page.url().includes('/parabank/index.htm')) {
    await page.goto('/parabank/index.htm');
    await page.waitForLoadState('networkidle');
  }

  const loginPage = new LoginPage(page);
  await loginPage.retryLogin(user.username, user.password, 8, 1500);
}