import { test } from '@playwright/test';
import { loadJSON } from '../../utils/data.helper';
import { generateRandomString } from '../../utils/string.helper';
import { registerAndLogin } from '../../utils/test.helper';

const users = loadJSON('test-data/users.json');
const userTemplate = users[0];

const user = {
  ...userTemplate,
  username: `user_${generateRandomString(6)}`
};

test('Login with freshly registered user should succeed', async ({ page }) => {
  await registerAndLogin(page, user);
});