import { test, expect } from '@playwright/test';
import { FundTransferPage } from '../../pages/fund_transfer.page';
import { registerAndLogin } from '../../utils/test.helper';
import { generateRandomString } from '../../utils/string.helper';

const user = {
  firstName: 'Alice',
  lastName: 'Walker',
  address: '789 Park Ave',
  city: 'Miami',
  state: 'FL',
  zipCode: '33101',
  phone: '3055551234',
  ssn: '999-88-7777',
  username: `user_${generateRandomString(6)}`,
  password: 'password123'
};

test('Fund Transfer Test', async ({ page }) => {
  await registerAndLogin(page, user);

  // Go to Accounts Overview and get account ID
  await page.click('a[href="overview.htm"]');
  await page.waitForSelector('#accountTable tbody a');
  const accountLinks = await page.locator('#accountTable tbody a').allInnerTexts();
  const accountId = accountLinks[0];
  console.log(`Using account ID: ${accountId}`);
  const fundTransferPage = new FundTransferPage(page);
  await fundTransferPage.goto();

  // Optional: Hard wait for dropdown to populate (for debugging)
  await page.waitForTimeout(2000);

  // Use the same account for both from and to, as Parabank allows this
  await fundTransferPage.transferFunds('100', accountId, accountId);
  await fundTransferPage.assertTransferSuccess();
  await fundTransferPage.logout();
});