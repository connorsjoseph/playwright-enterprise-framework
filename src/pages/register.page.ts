import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/parabank/register.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async register(user: {
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
    await this.page.fill('input[name="customer.firstName"]', user.firstName);
    await this.page.fill('input[name="customer.lastName"]', user.lastName);
    await this.page.fill('input[name="customer.address.street"]', user.address);
    await this.page.fill('input[name="customer.address.city"]', user.city);
    await this.page.fill('input[name="customer.address.state"]', user.state);
    await this.page.fill('input[name="customer.address.zipCode"]', user.zipCode);
    await this.page.fill('input[name="customer.phoneNumber"]', user.phone);
    await this.page.fill('input[name="customer.ssn"]', user.ssn);
    await this.page.fill('input[name="customer.username"]', user.username);
    await this.page.fill('input[name="customer.password"]', user.password);
    await this.page.fill('input[name="repeatedPassword"]', user.password);
    await this.page.click('input[value="Register"]');
  }

  async assertRegistrationSuccess(username: string) {
    const welcomeMessage = await this.page.locator('h1').textContent();
    if (!welcomeMessage || !welcomeMessage.includes(`Welcome ${username}`)) {
      throw new Error(`Expected welcome message to include "Welcome ${username}", but got: ${welcomeMessage}`);
    }
  }

  async assertErrorMessages(expectedMessages: string[]) {
    const errorSpansLocator = this.page.locator('span.error');
    await expect(errorSpansLocator.first()).toBeVisible({ timeout: 3000 });
    const errorSpans = await errorSpansLocator.allTextContents();

    for (const expected of expectedMessages) {
      const found = errorSpans.some(text => text.includes(expected));
      if (!found) {
        throw new Error(`Expected error message "${expected}" was not found. Got: ${errorSpans.join(' | ')}`);
      }
    }
  }

  async assertRegistrationFailure(expectedMessages: string[]) {
    await this.assertErrorMessages(expectedMessages);
  }

  async registerAndAssertSuccess(user: {
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
    await this.goto();
    await this.register(user);
    await this.assertRegistrationSuccess(user.username);
  }

  async logout() {
    const logoutLink = this.page.locator('text=Log Out');
    await expect(logoutLink).toBeVisible({ timeout: 3000 });
    await logoutLink.click();
  }
 
  
}
