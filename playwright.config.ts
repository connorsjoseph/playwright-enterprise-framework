import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

console.log('Loaded BASE_URL:', process.env.BASE_URL);

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on', // <--- Add this line to enable video recording for all tests
  },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined
});