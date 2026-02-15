import { test, expect } from '@playwright/test';

test('User can purchase credits and generate report', async ({ page }) => {
  await page.goto('/dashboard');
  // Assume user is logged in and has 0 credits
  await page.click('button:has-text("Full Report")');
  await page.waitForURL(/stripe/);
  // Simulate Stripe payment success (mock or test mode)
  await page.goto('/dashboard?payment=success');
  await page.waitForSelector('text=Credits: 10');
  await page.click('button:has-text("Generate Report")');
  await page.waitForSelector('text=Download Report');
  expect(await page.isVisible('text=Download Report')).toBeTruthy();
});

