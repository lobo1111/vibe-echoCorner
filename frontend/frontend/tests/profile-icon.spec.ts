import { test, expect } from '@playwright/test';

/**
 * Tests to verify the ProfileIcon is present and properly positioned
 * in the top-right corner of the application.
 */
test('ProfileIcon is present in the top-right corner when authenticated', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Take a screenshot of the initial state for debugging
  await page.screenshot({ path: './initial-state.png' });
  
  // Log the page contents for debugging
  const initialHtml = await page.content();
  console.log('Initial HTML length:', initialHtml.length);
  console.log('Initial HTML contains profile-icon:', initialHtml.includes('profile-icon'));
  
  // Since the app starts with the login screen by default,
  // we need to authenticate or simulate authentication
  
  // Mock authentication by setting localStorage (used by your Auth module)
  await page.evaluate(() => {
    // Use the correct localStorage keys that match the Auth implementation
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    console.log('Setting correct authentication values in localStorage');
    // Reload to apply the authentication state
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot after authentication for debugging
  await page.screenshot({ path: './after-auth.png' });
  
  // Log the page HTML after authentication for debugging
  const afterAuthHtml = await page.content();
  console.log('After auth HTML length:', afterAuthHtml.length);
  console.log('After auth HTML contains profile-icon:', afterAuthHtml.includes('profile-icon'));
  
  // Debug what elements are present on the page
  const allElements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*')).map(el => ({
      tag: el.tagName,
      id: el.id || '',
      testId: el.getAttribute('data-testid') || '',
      className: el.className || ''
    }));
  });
  console.log('Elements with testId:', allElements.filter(el => el.testId));
  
  // Look for the ProfileIcon component
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  
  // Verify it exists
  expect(await profileIcon.count()).toBe(1);
  
  // Get the bounding box of the profile icon to check its position
  const iconBoundingBox = await profileIcon.boundingBox();
  
  // Get the viewport size
  const viewportSize = page.viewportSize();
  
  // Make sure we have valid measurements
  expect(iconBoundingBox).not.toBeNull();
  expect(viewportSize).not.toBeNull();
  
  if (iconBoundingBox && viewportSize) {
    // Check if the icon is positioned in the top part of the screen
    // (assuming top means within the first 20% of the viewport height)
    expect(iconBoundingBox.y).toBeLessThan(viewportSize.height * 0.2);
    
    // Check if the icon is positioned in the right part of the screen
    // (assuming right means the icon's right edge is within 20% of the viewport's right edge)
    const iconRightEdge = iconBoundingBox.x + iconBoundingBox.width;
    expect(iconRightEdge).toBeGreaterThan(viewportSize.width * 0.8);
  }
  
  // Take a screenshot for visual confirmation
  await page.screenshot({ path: './profile-icon-test.png' });
});

// Test that the ProfileIcon is not visible when not authenticated
test('ProfileIcon is not visible when not authenticated', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Clear any authentication
  await page.evaluate(() => {
    // Use the correct localStorage keys that match the Auth implementation
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    // Reload to apply the authentication state
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Check that the ProfileIcon is not visible
  const profileIcon = await page.locator('[data-testid="profile-icon"]');
  expect(await profileIcon.count()).toBe(0);
}); 