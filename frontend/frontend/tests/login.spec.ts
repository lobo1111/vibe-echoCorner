import { test, expect } from '@playwright/test';

test('login screen renders properly', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  try {
    // Wait for the React app to load
    await page.waitForSelector('#root', { timeout: 20000 });
    console.log('Root element found');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: './login-screen-test.png' });
    
    // Output the full page HTML for detailed debugging
    const html = await page.content();
    console.log('Full page HTML:', html);
    
    // Get all visible text on the page
    const textContent = await page.evaluate(() => document.body.textContent);
    console.log('Text content on the page:', textContent);
    
    // List all elements in the DOM
    const elements = await page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      return allElements.map(el => ({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        text: el.textContent?.trim().substring(0, 50) || ''
      }));
    });
    console.log('DOM Elements (first 10):', elements.slice(0, 10));
    
    // Verify at least the root element is there
    expect(await page.$('#root')).not.toBeNull();
  } catch (error) {
    console.error('Error analyzing login screen:', error);
    throw error;
  }
}); 