import { Page, expect } from "@playwright/test";

export interface User {
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
}

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    if (!this.page.url().includes("/parabank/register.htm")) {
      await this.page.goto("/parabank/register.htm");
      await this.page.waitForLoadState("networkidle");
    }
  }

  async register(user: User) {
    await this.page.fill('input[name="customer.firstName"]', user.firstName);
    await this.page.fill('input[name="customer.lastName"]', user.lastName);
    await this.page.fill('input[name="customer.address.street"]', user.address);
    await this.page.fill('input[name="customer.address.city"]', user.city);
    await this.page.fill('input[name="customer.address.state"]', user.state);
    await this.page.fill(
      'input[name="customer.address.zipCode"]',
      user.zipCode
    );
    await this.page.fill('input[name="customer.phoneNumber"]', user.phone);
    await this.page.fill('input[name="customer.ssn"]', user.ssn);
    await this.page.fill('input[name="customer.username"]', user.username);
    await this.page.fill('input[name="customer.password"]', user.password);
    await this.page.fill('input[name="repeatedPassword"]', user.password);

    await this.page.click('input[value="Register"]');
    // Wait for the welcome message to confirm registration success
  }

  async assertRegistrationSuccess(username: string) {
    const welcomeMessageLocator = this.page.locator("h1");
    await expect(welcomeMessageLocator).toBeVisible({ timeout: 5000 });
    await expect(welcomeMessageLocator).toContainText(`Welcome ${username}`);
  }

  async assertErrorMessages(expectedMessages: string[]) {
    const errorSpansLocator = this.page.locator("span.error");
    await expect(errorSpansLocator.first()).toBeVisible({ timeout: 3000 });

    const actualMessages = (await errorSpansLocator.allTextContents()).map(
      (e) => e.trim()
    );

    const notFound: string[] = [];

    for (const expected of expectedMessages) {
      if (!actualMessages.includes(expected.trim())) {
        notFound.push(expected);
      }
    }

    if (notFound.length > 0) {
      throw new Error(
        `❌ The following expected errors were NOT found:\n- ${notFound.join(
          "\n- "
        )}\n\n✅ Actual errors on screen:\n- ${actualMessages.join("\n- ")}`
      );
    }
  }

  async registerAndAssertSuccess(user: User) {
    await this.goto();
    await this.register(user);
    await this.assertRegistrationSuccess(user.username);
  }

  async logout() {
    const logoutLink = this.page.locator("text=Log Out");
    await expect(logoutLink).toBeVisible({ timeout: 3000 });
    await logoutLink.click();
  }
}
