import { test, expect } from '@playwright/test';

test('should not throw runtime errors on load', async ({ page }) => {
  const errors: string[] = [];
  const consoleMessages: { type: string; text: string }[] = [];

  // Capture page errors (exceptions)
  page.on('pageerror', (err) => {
    console.log('Page error:', err.message);
    errors.push(err.message);
  });

  // Capture all console messages for better diagnostics
  page.on('console', (msg) => {
    consoleMessages.push({ 
      type: msg.type(), 
      text: msg.text() 
    });
    
    // Log errors to the test output
    if (msg.type() === 'error') {
      console.log(`Console ${msg.type()}:`, msg.text());
    }
  });

  // Navigate to the app
  await page.goto('/');
  
  // Wait for the page to stabilize
  await page.waitForTimeout(3000);

  // Detailed diagnostics if errors are found
  if (errors.length > 0) {
    console.error('\n==== RUNTIME ERRORS DETECTED ====');
    errors.forEach((error, index) => {
      console.error(`[Error ${index + 1}] ${error}`);
    });
    
    // Print recent console logs for context
    console.error('\n==== RECENT CONSOLE LOGS ====');
    consoleMessages.slice(-10).forEach((msg, index) => {
      console.error(`[${msg.type}] ${msg.text}`);
    });
  }

  // Check specifically for Amplify or loginWith related errors
  const amplifyErrors = errors.filter(e => 
    e.includes('Amplify') || 
    e.includes('loginWith') || 
    e.includes('Cannot read properties of undefined')
  );

  if (amplifyErrors.length > 0) {
    console.error('\n==== AWS AMPLIFY ERRORS DETECTED ====');
    amplifyErrors.forEach((error, index) => {
      console.error(`[Amplify Error ${index + 1}] ${error}`);
    });
  }

  // Create a detailed error message for the assertion
  const errorDetail = errors.length > 0 
    ? `\n\nRuntime Errors (${errors.length}):\n${errors.join('\n')}\n\nRecent Console Logs:\n${
        consoleMessages.slice(-5).map(m => `[${m.type}] ${m.text}`).join('\n')
      }`
    : '';

  // Assert no errors were found
  expect(errors.length, `JavaScript runtime errors detected${errorDetail}`).toBe(0);
}); 