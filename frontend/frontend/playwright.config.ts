import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,
  testIgnore: /.*\.test\.js/,
  use: {
    baseURL: 'http://localhost:8081',
    browserName: 'chromium',
    navigationTimeout: 60000,
    actionTimeout: 30000,
    screenshot: 'only-on-failure',
    javaScriptEnabled: true,
  },
  timeout: 60000,
  reporter: 'list',
  webServer: {
    command: 'npm run web',
    url: 'http://localhost:8081',
    reuseExistingServer: true,
    timeout: 60000,
  },
}); 