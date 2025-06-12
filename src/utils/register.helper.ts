import { Page } from "@playwright/test";
import { RegisterPage } from "../pages/register.page";
import { User } from "../types/user";
import { generateRandomString } from "./string.helper";

/**
 * Registers a new user with optional overrides.
 */
export async function registerNewUser(page: Page, userData: Partial<User> = {}): Promise<User> {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  const user: User = {
    firstName: userData.firstName || "Test",
    lastName: userData.lastName || "User",
    address: userData.address || "123 Main St",
    city: userData.city || "Anytown",
    state: userData.state || "CA",
    zipCode: userData.zipCode || "12345",
    phone: userData.phone || "1234567890",
    ssn: userData.ssn || "111-22-3333",
    username: userData.username || `user_${generateRandomString(5)}`,
    password: userData.password || "Password123",
  };

  await registerPage.register(user);
  return user;
}
