import { test, expect } from '@playwright/test';
import { BillPayPage } from '../../pages/billpay.page';
import { LoginPage } from '../../pages/login.page';

test.describe('Bill Pay', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('john', 'demo');
    await expect(page).toHaveURL(/.*parabank\/overview/);
    console.log(`🔁 Running Retry #: ${testInfo.retry}`);
  });

  test('should pay bill successfully', async ({ page }) => {
    const billPayPage = new BillPayPage(page);
    await billPayPage.goto();
    await billPayPage.payBill({
      payeeName: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      phone: '555-1234',
      account: '123456',
      verifyAccount: '123456',
      amount: '100',
      fromAccount: '13344', // Ensure this account exists
    });

    await expect(billPayPage.successMessage).toBeVisible();
    console.log('✅ Bill payment success message is visible.');
    
  });

  test('should show error for missing required fields', async ({ page }) => {
    const billPayPage = new BillPayPage(page);
    await billPayPage.goto();
    await billPayPage.payBill({}); // Send empty fields

    const errorLocators = page.locator('.error:visible');
    const errorCount = await errorLocators.count();
    console.log(`🔍 Error elements found: ${errorCount}`);
    await expect(errorLocators).toHaveCount(9); // Expected 9 visible errors

    const actualErrors = (await errorLocators.allTextContents()).map(e => e.trim());
    const expectedErrors = [
      'Payee name is required.',
      'Address is required.',
      'City is required.',
      'State is required.',
      'Zip Code is required.',
      'Phone number is required.',
      'Account number is required.',
      'Account number is required.',
      'The amount cannot be empty.',
    ];

    console.log('🟡 Actual Errors:', actualErrors);
    console.log('🟢 Expected Errors:', expectedErrors);

    // If order is not guaranteed, compare sorted arrays
    expect(actualErrors.length).toBe(expectedErrors.length);
    expectedErrors.forEach(error => {
      expect(actualErrors).toContain(error);
    });

  });

  test('should show error for account mismatch', async ({ page }) => {
    const billPayPage = new BillPayPage(page);
    await billPayPage.goto();
    await billPayPage.payBill({
      payeeName: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      phone: '555-1234',
      account: '123456',
      verifyAccount: '654321', // Mismatched account
      amount: '100',
      fromAccount: '13344',
    });

    await expect(billPayPage.accountMismatchError).toBeVisible();
    await expect(billPayPage.accountMismatchError).toHaveText('The account numbers do not match.');
    console.log('❌ Mismatched account numbers error displayed correctly.');
  });
  

  // 🔧 Future enhancement: test for invalid amount, account not selected, special characters, etc.
});
