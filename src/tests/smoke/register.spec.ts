// test/registration.spec.ts
import { test } from '@playwright/test';
import { loadJSON } from '../../utils/data.helper';
import { registerNewUser } from '../../utils/register.helper';
import { User } from '../../types/user';
import { RegisterPage } from '../../pages/register.page';

const users: Partial<User>[] = loadJSON('test-data/users.json');

test.describe('User Registration Tests', () => {

  // ✅ Positive: Register with unique usernames using the helper
  test('Register with unique usernames from test data', async ({ page }) => {
    for (const [index, userData] of users.entries()) {
      const user = await registerNewUser(page, userData);
      console.log(`User ${index + 1} registered successfully with username: ${user.username}`);
    }
  });

  // ❌ Negative: Register with missing required fields
 const errorMessages = loadJSON<{ missingFields: string[] }>('test-data/error-messages/registration.errors.json');

test('Register with missing required fields should fail', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  const emptyUser: User = {
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

  await registerPage.goto();
  await registerPage.register(emptyUser);

  await registerPage.assertErrorMessages(errorMessages.missingFields);
});

});
