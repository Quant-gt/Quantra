const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\ssbis\\.gemini\\antigravity\\brain\\a766d188-d1eb-4f75-84ce-f72000a29881';
const BASE_URL = 'https://sigmaspire.vercel.app';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

const logs = {
  console: [],
  networkErrors: [],
  failedTests: [],
  passedTests: []
};

async function runTests() {
  console.log('Starting regression tests...');
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name === 'mobile' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' : undefined
    });

    const page = await context.newPage();

    // Listeners
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        logs.console.push(`[${vp.name}] ${msg.type()}: ${msg.text()}`);
      }
    });

    page.on('requestfailed', request => {
      logs.networkErrors.push(`[${vp.name}] Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });

    try {
      // 1. Suite A: Navigation & Routing Integrity
      console.log('Running Suite A: Navigation');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `screenshot_${vp.name}_home.png`), fullPage: true });

      // Check header links (desktop only for simple direct clicks, mobile uses hamburger)
      if (vp.name === 'desktop') {
        const links = ['Marketplace', 'Backtest', 'Blog', 'Daily News', 'Pricing'];
        for (const link of links) {
          const locator = page.locator(`nav >> text=${link}`).first();
          if (await locator.isVisible()) {
            await locator.click();
            await page.waitForLoadState('networkidle');
            logs.passedTests.push(`Suite A: Header Navigation - ${link}`);
            
            // Go back home
            await page.goto(BASE_URL, { waitUntil: 'networkidle' });
          } else {
            logs.failedTests.push(`Suite A: Header Navigation - ${link} not visible`);
          }
        }
      } else {
        // Mobile hamburger test
        const menuBtn = page.locator('button:has(svg.lucide-menu), button:has(svg.lucide-align-justify)').first();
        if (await menuBtn.isVisible()) {
          await menuBtn.click();
          await page.waitForTimeout(500); // wait for animation
          await page.screenshot({ path: path.join(ARTIFACTS_DIR, `screenshot_${vp.name}_mobile_menu.png`) });
          logs.passedTests.push(`Suite D: Mobile Menu opens on ${vp.name}`);
        }
      }

      // 2. Suite B: Daily News Page
      console.log('Running Suite B: Daily News');
      await page.goto(`${BASE_URL}/daily-news`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // wait for any client fetches
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `screenshot_${vp.name}_daily-news.png`), fullPage: true });

      const tabs = ['All Updates', 'Company News', 'Announcements (BSE/NSE)', 'Earnings', 'FII / DII Flows'];
      for (const tab of tabs) {
        const tabLocator = page.locator(`button:has-text("${tab}")`).first();
        if (await tabLocator.isVisible()) {
          await tabLocator.click();
          await page.waitForTimeout(1000); // wait for re-render
          
          // Check for "No updates found"
          const emptyState = await page.locator('text=No updates found').isVisible();
          if (emptyState) {
             // Only fail if it's completely empty. If we expect data, this is a failure.
             logs.failedTests.push(`Suite B: Daily News - ${tab} tab shows empty state`);
          } else {
             logs.passedTests.push(`Suite B: Daily News - ${tab} tab has data`);
          }
        }
      }

      // 3. Suite C: Interactive Components
      console.log('Running Suite C: Interactive Components');
      await page.goto(`${BASE_URL}/backtest`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `screenshot_${vp.name}_backtest.png`), fullPage: true });
      logs.passedTests.push(`Suite C: Backtest Page loads on ${vp.name}`);

      await page.goto(`${BASE_URL}/marketplace`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, `screenshot_${vp.name}_marketplace.png`), fullPage: true });
      logs.passedTests.push(`Suite C: Marketplace Page loads on ${vp.name}`);

    } catch (e) {
      console.error(`Error during viewport ${vp.name}:`, e);
      logs.failedTests.push(`Viewport ${vp.name} encountered critical error: ${e.message}`);
    }

    await context.close();
  }

  await browser.close();
  
  // Write logs out to JSON for parsing later
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'scratch', 'test_results.json'), JSON.stringify(logs, null, 2));
  console.log('Tests completed. Results saved.');
}

runTests().catch(console.error);
