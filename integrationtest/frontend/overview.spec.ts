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
