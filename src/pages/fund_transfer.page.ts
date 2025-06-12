import { Page, expect } from "@playwright/test";

export class FundTransferPage {
  constructor(private page: Page) {}

  async goto() {
    // If already on the page, no need to click again
    if (!this.page.url().includes("transfer.htm")) {
      await Promise.all([
        this.page.click('a[href="transfer.htm"]'),
        this.page.waitForLoadState("networkidle"),
      ]);
    }
    await expect(
      this.page.getByRole("heading", { name: "Transfer Funds" })
    ).toBeVisible();
  }

  async transferFunds(amount: string, fromAccount: string, toAccount: string) {
    await this.page.fill("input#amount", amount);
    await this.page.selectOption("select#fromAccountId", fromAccount);
    await this.page.selectOption("select#toAccountId", toAccount);

    await this.page.click('input[value="Transfer"]');
    // Wait for the success message to appear
    await expect(
      this.page.locator("h1.title", { hasText: "Transfer Complete!" })
    ).toBeVisible({ timeout: 5000 });
  }
  async getAccountIds(): Promise<string[]> {
    // Navigate to the Accounts Overview page
    await this.page.click('a[href="overview.htm"]');
    await this.page.waitForSelector("#accountTable tbody a");

    // Extract and return all account IDs (as text)
    const accountIds = await this.page
      .locator("#accountTable tbody a")
      .allInnerTexts();
    return accountIds;
  }
  async assertTransferFailure(expectedError: string) {
    // Wait until an error appears in the right panel
    const errorPanel = this.page.locator("#rightPanel");
    await expect(errorPanel).toContainText(expectedError);
  }

  async assertTransferSuccess() {
    const successHeading = this.page.locator("h1.title", {
      hasText: "Transfer Complete!",
    });
    await expect(successHeading).toBeVisible({ timeout: 5000 });
  }
}
