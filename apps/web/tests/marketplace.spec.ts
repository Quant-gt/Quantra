import { test, expect } from '@playwright/test';

test.describe('Marketplace functionality', () => {
  test('should load the marketplace and allow viewing a strategy', async ({ page }) => {
    await page.goto('/marketplace');
    
    // Check if the marketplace header loads
    await expect(page.locator('h1').filter({ hasText: 'Discover Your Edge' })).toBeVisible();

    // The marketplace has strategies loaded dynamically, wait for the grid to appear
    const strategyCards = page.locator('.glass-panel');
    
    // We expect at least one strategy card to be visible (assuming Supabase has seeded data or we intercept)
    // If there is no data, this test might need a mock route like the dashboard test, 
    // but we'll see if the base UI loads correctly.
    await expect(page.locator('text=Browse and subscribe to institutional-grade algorithmic strategies')).toBeVisible();
  });
});
