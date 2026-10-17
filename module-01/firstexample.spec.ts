import { test, expect } from "@playwright/test";

const USERNAME = process.env.TEST_USER_USERNAME ?? "standard_user";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "pizza123";

test.describe("Smoke OmniPizza", ()=>{
    test("TC-01 - Successfull login using valid credentials", async ({page}) =>{
        //Arrange
        await page.goto("/");

        //Act
        await page.getByTestId("username-desktop").fill(USERNAME);

        await page.getByTestId("password-desktop").fill(PASSWORD);

        await page.getByTestId("login-button-desktop").click();

        //Assert
        await expect(page).toHaveURL(/\/catalog/);
    })

    test('test with codegen', async ({ page }) => {
  await page.goto('https://omnipizza-frontend.onrender.com/');
  await page.getByTestId('username-desktop').click();
  await page.getByTestId('username-desktop').fill('asd');
  await page.getByTestId('username-desktop').click();
  await page.getByTestId('username-desktop').fill('standard_user');
  await page.getByTestId('username-desktop').press('Tab');
  await page.getByTestId('password-desktop').fill('pizza123');
  await page.getByTestId('login-button-desktop').click();
  await page.getByText('MargheritaTomato, mozzarella, basil$12.99PepperoniPepperoni, mozzarella, tomato').click();
  await expect(page.getByText('MargheritaTomato, mozzarella, basil$12.99PepperoniPepperoni, mozzarella, tomato')).toBeVisible();
});
})