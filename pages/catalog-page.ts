import { expect, type Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export type Category = "all" | "popular" | "veggie" | "meat" | "sides";

export class CatalogPage extends BasePage{
    readonly path = "/catalog";

    private cardPizza: string = "pizza-card-";
    private btnAddToCart: string = "add-to-cart-";
    private btnCheckoutNow: string = "cart-checkout-btn";
    private btnConfirmAddToCart: string = "confirm-add-to-cart";
    private btnCategory: string = "category-";
    private lblPizzaPrice:string = "pizza-price-";
    private lblCartCount: string = "nav-cart-count";


    // Private locators
    private get pizzaCards(): Locator {
        return this.page.locator(`[data-testid^="${this.cardPizza}"]`);
    }

    private get addToCartButton(): Locator{
        return this.page.locator(`[data-testid^="${this.btnAddToCart}"]`);
    }

    private categoryButton(category: Category): Locator{
        return this.tid(`${this.btnCategory}${category}`)
    }

    private get cartCount(): Locator{
        return this.tid(this.lblCartCount);
    }

    // Actions
    async waitForCatalog(): Promise<void>{
        await this.pizzaCards.first().waitFor({state: "visible", timeout: 30_000});
    }

    async selectCategory(category: Category): Promise<void>{
        await this.categoryButton(category).click();
    }

    async addfistPizza(): Promise<void>{
        await this.addToCartButton.first().click();
        await this.tid("size-small").click();
        await this.tid(this.btnConfirmAddToCart).click();
    }

    async openCustomizeForFirst(): Promise<void>{
        await this.addToCartButton.first().click();
    }

    async getFirstPizzaPrice(): Promise<string>{
        const price =  this.page.locator(`[data-testid^="${this.lblPizzaPrice}"]`).first();
        return (await price.innerText()).trim();
    }

    async getPizzaCount(): Promise<number>{
        return this.pizzaCards.count();
    }

    async getPizzaNames(): Promise<string[]>{
        const names: string[] = [];
        const cards = await this.pizzaCards.all();
        for(const card of cards){
            const name = await card.getByRole("heading", {level: 2}).textContent();
            if(name) names.push(name.trim());
        }

        return names;
    }

    // Assertions
    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/catalog/);
        await expect(this.pizzaCards.first()).toBeVisible({timeout: 60_000});
    }

    async expectHasPizzas(): Promise<void>{
        const count = await this.getPizzaCount();
        expect(count).toBeGreaterThan(0);
    }

    async expectCartCount(n: number): Promise<void>{
        await expect(this.cartCount).toHaveText(String(n));
    }
}