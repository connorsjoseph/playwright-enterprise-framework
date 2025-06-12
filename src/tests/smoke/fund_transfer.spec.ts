import { test, expect } from '@playwright/test';
import { FundTransferPage } from '../../pages/fund_transfer.page';
import { registerNewUser } from '../../utils/register.helper';
import { loadJSON } from '../../utils/data.helper';
import { logoutAndLogin } from '../../utils/session.helper';
import { User } from '../../types/user';

type FundTransferTestData = {
  scenario: string;
  amount: string;
  fromAccount: string;
  toAccount: string;
  expectSuccess: boolean;
  expectedError?: string;
};

const users: Partial<User>[] = loadJSON('test-data/users.json');
const testCases: FundTransferTestData[] = loadJSON('test-data/fund-transfer.testdata.json');

test.describe('Fund Transfer Scenarios', () => {
  for (const testData of testCases) {
    test(`${testData.scenario}`, async ({ page }) => {
      const user = await registerNewUser(page, users[0]);
      await logoutAndLogin(page, user.username, user.password);

      const transferPage = new FundTransferPage(page);
      const accountIds = await transferPage.getAccountIds();
      const accountId = accountIds[0]; // use the first account

      const fromAcc = testData.fromAccount === 'same' ? accountId : accountIds[0];
      const toAcc = testData.toAccount === 'same' ? accountId : accountIds[1] || accountIds[0];

      await transferPage.goto();
      await transferPage.transferFunds(testData.amount, fromAcc, toAcc);

      if (testData.expectSuccess) {
        await transferPage.assertTransferSuccess();
      } else {
        await transferPage.assertTransferFailure(testData.expectedError || 'Invalid operation');
      }
    });
  }
});
