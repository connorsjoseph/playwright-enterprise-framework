import { test, expect } from "@playwright/test";
import { BillPayPage } from "../../pages/billpay.page";
import { readCsvData } from "../../utils/csvReader";
import { registerNewUser } from "../../utils/register.helper";
import { logoutAndLogin } from "../../utils/session.helper";
import { loadJSON } from "../../utils/data.helper";
import { User } from "../../types/user";

// Load test data
const users: Partial<User>[] = loadJSON("test-data/users.json");
const positiveCases = readCsvData("test-data/Billpay/payee-positive-tests.csv");
const negativeCases = readCsvData("test-data/Billpay/payee-negative-tests.csv");

// Keys used for bill payment
const billFields = [
  "payeeName",
  "address",
  "city",
  "state",
  "zipCode",
  "phone",
  "account",
  "verifyAccount",
  "amount",
  "fromAccount",
];

test.describe("💸 Bill Pay", () => {
  let user: User;

  test.beforeEach(async ({ page }) => {
    user = await registerNewUser(page);
    await logoutAndLogin(page, user.username, user.password);
    await expect(page).toHaveURL(/.*parabank\/overview/);
  });

  // ✅ Positive Test Cases
  for (const data of positiveCases) {
    test(`✅ should pay bill for ${data.payeeName}`, async ({ page }) => {
      const billPayPage = new BillPayPage(page);
      await billPayPage.goto();

      const billData = Object.fromEntries(
        billFields.filter((key) => data[key]).map((key) => [key, data[key]])
      );

      await billPayPage.payBill(billData);
      await billPayPage.assertSuccess();
    });
  }

  // ❌ Negative Test Cases
  test.describe("❌ Negative Bill Payment Scenarios", () => {
    for (const data of negativeCases) {
      const errors = (data.error || "")
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean);

      const isAccountMismatch =
        errors.length === 1 &&
        errors[0] === "The account numbers do not match.";
      const title = `❌ should show ${
        isAccountMismatch
          ? "account mismatch error"
          : "validation errors for missing/invalid fields"
      }`;

      test(title, async ({ page }) => {
        const billPayPage = new BillPayPage(page);
        await billPayPage.goto();

        const billData = Object.fromEntries(
          billFields.filter((key) => data[key]).map((key) => [key, data[key]])
        );

        await billPayPage.payBill(billData);

        if (isAccountMismatch) {
          await billPayPage.assertAccountMismatchError();
        } else {
          await billPayPage.assertValidationErrorsCount(errors.length);
          const actualErrors = (await billPayPage.getAllValidationErrors()).map(
            (e) => e.trim()
          );

          try {
            expect(actualErrors).toEqual(errors); // strict match
          } catch {
            console.error("❌ Validation errors do not match!");
            console.table({ Expected: errors, Actual: actualErrors });
            throw new Error("Validation error mismatch.");
          }
        }
      });
    }
  });
});
