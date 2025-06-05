import { Page, expect } from '@playwright/test';

export class FundTransferPage {
  constructor(private page: Page) {}

async goto() {
  await this.page.click('a[href="transfer.htm"]');
  await expect(this.page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible();
}

 async transferFunds(amount: string, fromAccount: string, toAccount: string) {
  const amountInput = this.page.locator('input#amount');
  await amountInput.fill(amount);
  await this.page.selectOption('select#fromAccountId', fromAccount);
  await this.page.selectOption('select#toAccountId', toAccount);
  await this.page.click('input[value="Transfer"]');
}

  async assertTransferSuccess() {
  const successHeading = this.page.locator('h1.title', { hasText: 'Transfer Complete!' });
  await expect(successHeading).toBeVisible();
}
  async logout() {
    await this.page.click('a[href="logout.htm"]');
    // Optionally, assert logout success (e.g., login form is visible)
    await expect(this.page.locator('input[name="username"]')).toBeVisible();
  }
}
