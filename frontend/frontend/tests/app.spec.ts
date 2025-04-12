import { test, expect } from '@playwright/test';

test('app loads with expected title', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Check the page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Verify something loaded
  expect(title).not.toBe('');
  
  // Wait for root element
  const rootElement = await page.waitForSelector('#root', { timeout: 10000 });
  expect(rootElement).not.toBeNull();
  
  // Take a screenshot
  await page.screenshot({ path: './app-screenshot.png' });
  
  // Log page contents for debugging
  console.log('HTML contains root element:', (await page.content()).includes('id="root"'));
}); 