import { test, markets } from "../fixtures/omnipizza";
import { Currency } from "../types";

const currencySymbol: Partial<Record<Currency, string>> = {
    MXN: "$",
    JPY: "￥",
    SAR: "ر.س",
}

test.describe("Fixtures inject POM", () => {

    test("The fixtures deliver Login/Catalog pages ready to use", async({loginPage, catalogPage, standardUser, defaultMarket}) =>{
        await loginPage.goto();
        await loginPage.loginInMarket(standardUser, defaultMarket.code);

        await catalogPage.expectLoaded();
        await catalogPage.expectHasPizzas();
    })

    for (const market of markets) {
        test(`TC-${market.code} - login catalog in market ${market.code}`, { tag: "@smoke" }, async ({ loginPage, catalogPage, standardUser }) => {
            // const loginPage = new LoginPage(page);
            // const catalogPage = new CatalogPage(page);

            await loginPage.goto();
            await loginPage.expectLoaded();
            await loginPage.loginInMarket(standardUser, market.code);

            await catalogPage.waitForCatalog();
            const names = await catalogPage.getPizzaNames();
            console.log(`Pizzas lenght in ${market.country}: ${names.length}`);

            await catalogPage.expectHasPizzas();        
        })
    }
})