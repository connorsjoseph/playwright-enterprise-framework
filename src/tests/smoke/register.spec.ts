// test/registration.spec.ts
import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/register.page';
import { loadJSON } from '../../utils/data.helper';
import { generateRandomString } from '../../utils/string.helper';

const users = loadJSON('test-data/users.json');

test.describe('User Registration Tests', () => {

  // ✅ Positive: Register with unique usernames
  test('Register with unique usernames from test data', async ({ page }) => {
    for (const [index, userData] of users.entries()) {
      const randomUsername = `user_${generateRandomString(6)}`;
      const user = { ...userData, username: randomUsername };

      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.register(user);
      await registerPage.assertRegistrationSuccess(user.username);
      console.log(`User ${index + 1} registered successfully with username: ${user.username}`);
    }
  });

  // ❌ Negative: Register with missing required fields
  test('Register with missing required fields should fail', async ({ page }) => {
    const emptyUser = {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      ssn: '',
      username: '',
      password: ''
    };

    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(emptyUser);

    await registerPage.assertRegistrationFailure([
      'Social Security Number is required.',
      'First name is required.',
      'Username is required.',
      'Password is required.',
      'Password confirmation is required.',
      'Address is required.',
      'Last name is required.',
      'City is required.',
      'State is required.',
      'Zip Code is required.'
    ]);
  });

});
