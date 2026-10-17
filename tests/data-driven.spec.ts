import { test, expect } from "@playwright/test";
import usersJson from "../data/users.json" with {type: "json"};
import marketJson from "../data/markets.json" with {type: "json"};
import { Market, User, Currency } from "../types";

const markets = marketJson as Market[];
const users = usersJson as User[];

const standardUser = users.find((user) => user.username === "standard_user");

if (!standardUser) {
    throw new Error("data/users.json does not contain a user with username 'standard_user'. Check the data seed before running");
}

const currencySymbol: Partial<Record<Currency, string>> = {
    MXN: "$",
    JPY: "￥",
    SAR: "ر.س",
}

test.describe("Smoke parametriized by market", () => {
    for (const market of markets) {
        test(`TC-${market.code} - login catalog in market ${market.code}`, { tag: "@smoke" }, async ({ page }) => {
            //Arrange
            await page.goto("/");

            //Act
            await page.getByTestId("username-desktop").fill(standardUser.username);
            await page.getByTestId("password-desktop").fill(standardUser.password);
            await page.getByTestId(`market-${market.code}`).click();
            await page.getByTestId("login-button-desktop").click();

            //Assert
            await expect(page).toHaveURL(/\/catalog/);

            const pizzaCards = page.locator("[data-testid^='pizza-card-p']");
            await expect(pizzaCards.first()).toBeVisible();
            const allCards = await pizzaCards.all();
            expect(allCards.length).toBeGreaterThan(0);

            for(const card of allCards){
                await expect(card).toBeVisible();
            }

            const symbol = currencySymbol[market.currency];
            if(!symbol) return;

            await expect(page.locator("body")).toContainText(symbol);
        })
    }
})

