import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:5173');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FooBar - Overview/);
});

test('Is showing Blå vand as the first item', async ({ page }) => {
  await page.goto('localhost:5173');

  //Check that the currently shown item in the header is "Blå vand"
  await expect(page.locator('text=Blå vand').first()).toBeVisible();
});



test('Is showing the correct amount of items in the marquee', async ({ page }) => {
  await page.goto('localhost:5173');

  // Wait for the marquee element to be present
  await page.waitForSelector('.rfm-marquee');

  // Log the count of child elements within the marquee
  const childCount = await page.locator('.rfm-marquee .rfm-child').count();
  console.log('Number of child elements:', childCount);

  // Check that the amount of childs in the marquee is 8x2=16, 
  await expect(childCount).toBe(16);
});


test('Price comparison between header and duplicate element in the marquee', async ({ page }) => {
  await page.goto('localhost:5173');

  // Find the locator for the first element containing "DKK" in the header
  const headerPriceLocator = page.locator('text=DKK').first();
  await expect(headerPriceLocator).toBeVisible();

  // Extract the price from the header
  const headerPriceText = await headerPriceLocator.innerText();
  console.log('Price in header:', headerPriceText);

  // Find the locator for the first element in the marquee
  const marqueeChildPriceLocator = page.locator('.rfm-marquee .rfm-child').first();
  await expect(marqueeChildPriceLocator).toBeVisible();
  
  const firstElementPrice = marqueeChildPriceLocator.locator('text=DKK').first();

  // Extract the price from the marquee
  const marqueeChildPriceText = await firstElementPrice.innerText();
  console.log('Price in marquee:', marqueeChildPriceText);

  // Compare the prices
  await expect(headerPriceText).toContain(marqueeChildPriceText);
});
