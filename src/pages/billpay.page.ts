import { Page, Locator, expect } from '@playwright/test';

export class BillPayPage {
  readonly page: Page;
  readonly fields: Record<string, Locator>;
  readonly sendPaymentBtn: Locator;
  readonly successMessage: Locator;
  readonly allErrors: Locator;
  readonly accountMismatchError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fields = {
      payeeName: page.locator('input[name="payee.name"]'),
      address: page.locator('input[name="payee.address.street"]'),
      city: page.locator('input[name="payee.address.city"]'),
      state: page.locator('input[name="payee.address.state"]'),
      zipCode: page.locator('input[name="payee.address.zipCode"]'),
      phone: page.locator('input[name="payee.phoneNumber"]'),
      account: page.locator('input[name="payee.accountNumber"]'),
      verifyAccount: page.locator('input[name="verifyAccount"]'),
      amount: page.locator('input[name="amount"]'),
      fromAccount: page.locator('select[name="fromAccountId"]'),
    };
    this.sendPaymentBtn = page.locator('input[type="button"][value="Send Payment"]');
    this.successMessage = page.locator('h1:has-text("Bill Payment Complete")');
    this.allErrors = page.locator('.error:visible');
    this.accountMismatchError = page.locator('span#validationModel-verifyAccount-mismatch');
  }

  async goto() {
    await this.page.goto('/parabank/billpay.htm');
    await this.page.waitForLoadState('networkidle');
    await expect(this.sendPaymentBtn).toBeVisible();
  }

  async payBill(details: Record<string, string>) {
  for (const [key, value] of Object.entries(details)) {
    if (key === 'fromAccount') {
      //await this.fields[key].selectOption(value);
    } else {
      await this.fields[key].fill(value);
    }
  }

  await this.sendPaymentBtn.waitFor({ state: 'visible' });
  this.sendPaymentBtn.click()

  await this.page.waitForLoadState('networkidle');
}


  async assertSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async assertAccountMismatchError() {
    await expect(this.accountMismatchError).toBeVisible({ timeout: 3000 });
    await expect(this.accountMismatchError).toHaveText('The account numbers do not match.');
  }

  async assertValidationErrorsCount(expectedCount: number) {
    await expect(this.allErrors).toHaveCount(expectedCount);
  }

  async getAllValidationErrors(): Promise<string[]> {
    return await this.allErrors.allTextContents();
  }
}
