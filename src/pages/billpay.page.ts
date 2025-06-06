import { Page, Locator, expect } from '@playwright/test';

export class BillPayPage {
  readonly page: Page;
  readonly payeeName: Locator;
  readonly address: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zipCode: Locator;
  readonly phone: Locator;
  readonly account: Locator;
  readonly verifyAccount: Locator;
  readonly amount: Locator;
  readonly fromAccount: Locator;
  readonly sendPaymentBtn: Locator;
  readonly successMessage: Locator;
  readonly allErrors: Locator;
  readonly accountMismatchError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.payeeName = page.locator('input[name="payee.name"]');
    this.address = page.locator('input[name="payee.address.street"]');
    this.city = page.locator('input[name="payee.address.city"]');
    this.state = page.locator('input[name="payee.address.state"]');
    this.zipCode = page.locator('input[name="payee.address.zipCode"]');
    this.phone = page.locator('input[name="payee.phoneNumber"]');
    this.account = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccount = page.locator('input[name="verifyAccount"]');
    this.amount = page.locator('input[name="amount"]');
    this.fromAccount = page.locator('select[name="fromAccountId"]');
    this.sendPaymentBtn = page.locator('input[type="button"][value="Send Payment"]');
    this.successMessage = page.locator('h1:has-text("Bill Payment Complete")');
    this.allErrors = page.locator('.error:visible'); // Only visible errors
    this.accountMismatchError = page.locator('span#validationModel-verifyAccount-mismatch');
  }

  async goto() {
    // Wait for full page load before interacting
    await this.page.goto('/parabank/billpay.htm');
    await this.page.waitForLoadState('networkidle');
    await expect(this.sendPaymentBtn).toBeVisible();
  }

  async payBill(details: {
    payeeName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    account?: string;
    verifyAccount?: string;
    amount?: string;
    fromAccount?: string;
  }) {
    // Fill inputs only if provided, else clear them (optional)
    if (details.payeeName !== undefined) await this.payeeName.fill(details.payeeName);
    if (details.address !== undefined) await this.address.fill(details.address);
    if (details.city !== undefined) await this.city.fill(details.city);
    if (details.state !== undefined) await this.state.fill(details.state);
    if (details.zipCode !== undefined) await this.zipCode.fill(details.zipCode);
    if (details.phone !== undefined) await this.phone.fill(details.phone);
    if (details.account !== undefined) await this.account.fill(details.account);
    if (details.verifyAccount !== undefined) await this.verifyAccount.fill(details.verifyAccount);
    if (details.amount !== undefined) await this.amount.fill(details.amount);
    if (details.fromAccount !== undefined) {
      await this.fromAccount.selectOption(details.fromAccount);
    }

    // Wait for possible navigation or response after clicking
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('billpay') && resp.status() === 200).catch(() => {}),
      this.sendPaymentBtn.click(),
    ]);
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

  async getAllValidationErrors() {
    return await this.allErrors.allTextContents();
  }
}
