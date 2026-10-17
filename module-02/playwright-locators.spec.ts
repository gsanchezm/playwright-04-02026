import { test, expect } from "@playwright/test";

const USERNAME = process.env.TEST_USER_USERNAME ?? "standard_user";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "pizza123";

test.describe("Smoke with locator hierarchy", () =>{
    // "TC-001 - login + catalog applying the hierarchy @smoke"
    test("TC-001 - login + catalog applying the hierarchy", {tag: ['@smoke', '@regression']}, async ({page}) => {
        //Arrange
        await page.goto("/");

        //const usernameText = await page.getByText("Username").innerText();
        //const usernameText = await page.getByText("Username").textContent();
        const usernameText = await page.getByText("Username").innerHTML();
        console.log(usernameText);

        //Act
        await page.getByPlaceholder("standard_user").fill(USERNAME);

        await page.getByTestId("password-desktop").fill(PASSWORD);

        await page.getByRole("img", {name:"US flag"}).click();

        //await page.getByRole("button", {name:"Sign In"}).click();
        await page.getByRole("button", {name:/sign in/i}).click();

        await expect(page).toHaveURL(/\/catalog/);

        await page.getByAltText("Pepperoni").click();

        const pizzaCards = page.locator("[data-testid^='pizza-card-p']");
        await expect(pizzaCards.first()).toBeVisible();

        console.log(await pizzaCards.getByRole("heading", {level:2}).allInnerTexts());
        console.log(await pizzaCards.getByRole("heading", {level:2}).nth(0).innerText());


        const hawaiian = await pizzaCards.nth(2).innerText();
        // Coincidencia exacta
        //expect(hawaiian).toBe("Hawaiian");
        //parcial
        expect(hawaiian).toContain("Hawaiian");
        //Regex
         expect(hawaiian).toMatch(/hawaiian/i);
        // No este vacío
         expect(hawaiian).toBeTruthy();

        console.log(hawaiian);
        await pizzaCards.nth(2).click();

        const funghi = await pizzaCards.filter({hasText:"Funghi"}).textContent();
        console.log(funghi);

        const funghiText = pizzaCards.filter({hasText: "Funghi"});
        expect(funghiText).toContainText("Mushrooms");
        
        const count = await pizzaCards.count();
        console.log(count);
        expect(count).toBeGreaterThan(0); //<1;
        expect(count).toBeGreaterThanOrEqual(1); //<=1 

        const fourCheese = await page.getByRole("heading", {level:2}).filter({hasText:"Cheese"}).innerText();
        console.log(fourCheese);


    })
})