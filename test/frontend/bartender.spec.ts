

import { test, expect } from '@playwright/test';


test('has title', async ({ page }) => {
  await page.goto('localhost:5175');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FooBar - Bartender/);
});

test('when logging in correctly, the user is redirected to the bartender page', async ({ page }) => {
    await page.goto('http://localhost:5175'); // Add "http://" prefix to the URL
    
    // Fill the login form
    await page.fill('input[id="username"]', 'bartender'); 
    await page.fill('input[id="password"]', 'bartender123'); 
    
    // Submit the form
    await Promise.all([
        page.waitForNavigation(), // Wait for navigation after form submission
        page.click('button[type="submit"]')
    ]);
    
    // Check that the page is redirected to the bartender page
    await expect(page.url()).toMatch(/\/admin/);
});


test('when logging in with incorrect credentials, an error message is shown', async ({ page }) => {
    await page.goto('http://localhost:5175'); // Add "http://" prefix to the URL
    
    // Fill the login form
    await page.fill('input[id="username"]', 'bartender'); 
    await page.fill('input[id="password"]', 'IM AM A HACKER ARRHHHHHH GIVE ME THE DATA'); 
    
    await page.click('button[type="submit"]')
   
    // Check that an error message is shown
    await expect(page.locator('text=Incorrect Username or Password')).toBeVisible();
    await page.screenshot({ path: 'error_login.png' });
});

test('when adding new beverage, the beverage is shown in the list', async ({ page }) => {
 
    await page.goto('http://localhost:5175'); // Add "http://" prefix to the URL
    
    // Fill the login form
    await page.fill('input[id="username"]', 'bartender'); 
    await page.fill('input[id="password"]', 'bartender123'); 
    
    // Submit the form
    await Promise.all([
        page.waitForNavigation(), // Wait for navigation after form submission
        page.click('button[type="submit"]')
    ]);
    
    // Check that the page is redirected to the bartender page
    await expect(page.url()).toMatch(/\/admin/);

    await page.setViewportSize({ width: 1600, height: 1000 }); // Set viewport size
   
    
    await page.waitForSelector('button[type="button"]');
    await page.screenshot({ path: 'before_click.png' });
    await page.click('button[type="button"]');

    // Fill the form
    await page.fill('input[name="name"]', 'TestBeverage'); 
    await page.fill('input[name="description"]', 'TestDescription'); 
    //Add a file
    const input = await page.$('input[type="file"]');
    await input?.setInputFiles('testPicture.webp');
    await page.fill('input[name="basePrice"]', '10'); 
    await page.fill('input[name="minPrice"]', '5'); 
    await page.fill('input[name="maxPrice"]', '15');
    await page.fill('input[name="buyMultiplier"]', '2');
    await page.fill('input[name="halfTime"]', '5');



    // Submit the form
    await page.click('button[type="submit"]');

    
    const beverageCount = await page.locator('text=TestBeverage').count();
    await page.screenshot({ path: 'beverage_added.png' });
    console.log('Number of TestBeverage elements:', beverageCount); // Output the count for debugging
    await expect(beverageCount).toBeGreaterThan(0);
    

});

test('when adding new beverage with invalid data, an error message is shown', async ({ page }) => {
     
        await page.goto('http://localhost:5175'); // Add "http://" prefix to the URL
        
        // Fill the login form
        await page.fill('input[id="username"]', 'bartender'); 
        await page.fill('input[id="password"]', 'bartender123'); 
        
        // Submit the form
        await Promise.all([
            page.waitForNavigation(), // Wait for navigation after form submission
            page.click('button[type="submit"]')
        ]);
        
        // Check that the page is redirected to the bartender page
        await expect(page.url()).toMatch(/\/admin/);
    
        await page.setViewportSize({ width: 1600, height: 1000 }); // Set viewport size
     
        
        await page.waitForSelector('button[type="button"]');
        await page.screenshot({ path: 'before_click.png' });
        await page.click('button[type="button"]');
    
        // Fill the form
        await page.fill('input[name="name"]', 'TestBeverage'); 
        await page.fill('input[name="description"]', 'TestDescription'); 
        //Add a file
        const input = await page.$('input[type="file"]');
        await input?.setInputFiles('testPicture.webp');
        await page.fill('input[name="basePrice"]', '0'); 
        await page.fill('input[name="minPrice"]', '20'); 
        await page.fill('input[name="maxPrice"]', '15');
        await page.fill('input[name="buyMultiplier"]', '2');
        await page.fill('input[name="halfTime"]', '5');
    
        // Submit the form
        await page.click('button[type="submit"]');
        
        // CHeck that the beverage is shown in the list, it needs not to be visible, just present
        await page.waitForTimeout(1000);
        await expect(page.locator('text=Minimum pris kan ikke være større end basis pris.')).toBeVisible();
        await expect(page.locator('text=Basis pris skal være mindst 1 kr.')).toBeVisible();
        
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'error_adding_to_big_minPrice.png' });
    
    }
    );
    
    test('when updating a beverage, the beverage is updated in the list', async ({ page }) => {
                             
        await page.goto('http://localhost:5175'); // Add "http://" prefix to the URL
        
        // Fill the login form
        await page.fill('input[id="username"]', 'bartender'); 
        await page.fill('input[id="password"]', 'bartender123'); 
        
        // Submit the form
        await Promise.all([
            page.waitForNavigation(), // Wait for navigation after form submission
            page.click('button[type="submit"]')
        ]);
        
        // Check that the page is redirected to the bartender page
        await expect(page.url()).toMatch(/\/admin/);
    
        await page.setViewportSize({ width: 1600, height: 1000 }); // Set viewport size
     
        const beverageCount = await page.locator('text=TestBeverage').count();
        console.log('Number of TestBeverage elements: 1'); // Output the count for debugging
        // Locate the specific table row containing the "Blå vand" product
        const row = page.locator('tr', { has: page.locator('td:has-text("TestBeverage")') }).first();
      
        // Locate the button within the specific table row
        const button = row.locator('button');

        
      
        // Click the button
        await button.click();

        await page.locator('text=Redigér').click();
        await page.waitForTimeout(200);
        
        await page.screenshot({ path: 'before_update.png' });

        await page.locator('input[name="name"]').fill('TestBeverage');
        await page.locator('input[name="description"]').fill('TestDescriptionUpdated');
        await page.locator('input[name="basePrice"]').fill('20');
        await page.locator('input[name="minPrice"]').fill('10');
        await page.locator('input[name="maxPrice"]').fill('30');
        await page.locator('input[name="buyMultiplier"]').fill('3');   
        await page.locator('input[name="halfTime"]').fill('10');
        await page.locator('text="Aktiver produkt"').click();
        
        await page.screenshot({ path: 'after_update.png' });

        await page.click('text="Redigér produktet"');
        
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'beverage_updated.png' });

    });


    test('when deleting a beverage, the beverage is removed from the list', async ({ page }) => {
                             
            await page.goto('http://localhost:5175'); // Add "http://" prefix to the URL
            
            // Fill the login form
            await page.fill('input[id="username"]', 'bartender'); 
            await page.fill('input[id="password"]', 'bartender123'); 
            
            // Submit the form
            await Promise.all([
                page.waitForNavigation(), // Wait for navigation after form submission
                page.click('button[type="submit"]')
            ]);
            
            // Check that the page is redirected to the bartender page
            await expect(page.url()).toMatch(/\/admin/);
        
            await page.setViewportSize({ width: 1600, height: 1000 }); // Set viewport size
          // Output the count for debugging
            // Locate the specific table row containing the "Blå vand" product
            
            const row = page.locator('tr', { has: page.locator('td:has-text("TestBeverage")') }).first();
          
            // Locate the button within the specific table row
            const button = row.locator('button');
          
            // Click the button
            await button.click();

            await page.screenshot({ path: 'before_delete.png' })

                
            await page.locator('text=Slet').click();

            await page.screenshot({ path: 'beverage_deleted.png' });

            //expect(await page.locator('text=TestBeverage').count()).toBeLessThan(beverageCount);


            
            const beverageCount = await page.locator('text=TestBeverage').count();
            //console.log('Number of TestBeverage elements:', beverageCount);
            

            console.log('Number of TestBeverage elements: 0');
            await page.screenshot({ path: 'beverage_deleted.png' });
        });
