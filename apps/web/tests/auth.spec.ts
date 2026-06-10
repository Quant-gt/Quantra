import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Find the login link and click it
    await page.click('a:has-text("Sign In")');
    
    // Verify we are on the login page
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('should verify signup flow is accessible', async ({ page }) => {
    // Navigate directly to auth
    await page.goto('/auth');
    
    // Wait for the Sign up toggle button
    await page.click('text=Sign up');
    
    // Verify the UI changes to "Create an account"
    await expect(page.locator('h1')).toContainText('Create an account');
  });
});
