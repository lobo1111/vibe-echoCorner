import { test, expect } from '@playwright/test';

/**
 * Tests to verify the Profile Dropdown Menu functionality
 */
test('profile dropdown menu displays both options when clicked', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Mock authentication to access the home screen
  await page.evaluate(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Find and click the profile icon
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  await profileIcon.click();
  
  // Wait for the dropdown menu to appear
  const dropdownMenu = await page.locator('[data-testid="profile-dropdown-menu"]').first();
  await expect(dropdownMenu).toBeVisible();
  
  // Verify both menu options are displayed
  const profileButton = await page.locator('[data-testid="profile-button"]').first();
  const logoutButton = await page.locator('[data-testid="logout-button"]').first();
  
  await expect(profileButton).toBeVisible();
  await expect(logoutButton).toBeVisible();
  
  // Verify the text in each button
  const profileText = await profileButton.locator('text=Profile');
  const logoutText = await logoutButton.locator('text=Logout');
  
  await expect(profileText).toBeVisible();
  await expect(logoutText).toBeVisible();
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: './profile-dropdown-test.png' });
});

test('clicking outside the dropdown menu closes it', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Mock authentication to access the home screen
  await page.evaluate(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Find and click the profile icon
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  await profileIcon.click();
  
  // Wait for the dropdown menu to appear
  const dropdownMenu = await page.locator('[data-testid="profile-dropdown-menu"]').first();
  await expect(dropdownMenu).toBeVisible();
  
  // Click outside the menu (on the overlay)
  await page.mouse.click(10, 10);
  
  // Verify the menu is now hidden
  await expect(dropdownMenu).not.toBeVisible();
});

test('clicking profile button shows profile alert', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Mock authentication to access the home screen
  await page.evaluate(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      username: 'testuser@example.com',
      attributes: {
        email: 'testuser@example.com',
        email_verified: true,
        sub: '12345-abcde-67890-fghij'
      }
    }));
    window.location.reload();
  });
  
  // Wait for the page to reload and stabilize
  await page.waitForLoadState('networkidle');
  
  // Find and click the profile icon
  const profileIcon = await page.locator('[data-testid="profile-icon"]').first();
  await profileIcon.click();
  
  // Wait for the dropdown menu to appear
  await page.locator('[data-testid="profile-dropdown-menu"]').first();
  
  // Set up an alert monitor before clicking
  const alertPromise = page.waitForEvent('dialog');
  
  // Find and click the profile button
  const profileButton = await page.locator('[data-testid="profile-button"]').first();
  await profileButton.click();
  
  // Wait for and verify the alert
  const alert = await alertPromise;
  expect(alert.type()).toBe('alert');
  expect(alert.message()).toContain('Profile settings will be available');
  
  // Dismiss the alert
  await alert.dismiss();
}); 