import type {Page, Locator, expect} from "@playwright/test";
import { LoginPage, CatalogPage} from "../pages";
import { Market, User } from "../types";

import usersJson from "../data/users.json" with {type: "json"};
import marketJson from "../data/markets.json" with {type: "json"};


private btnClose: string = "customizer-close";
  private btnSize: string = "size-";
  private chipTopping: string = "topping-";
  private lblPrice: string = "customizer-price";
  private btnConfirm: string = "confirm-add-to-cart";
  
  private sizeButton(size: PizzaSize): Locator {
    return this.page.getByTestId(`${this.btnSize}${size}`);
  }
  
  private toppingChip(name: string): Locator {
    return this.page.getByTestId(`${this.chipTopping}${name}`);
  }
  
  private get priceLabel(): Locator {
    return this.page.getByTestId(this.lblPrice);
  }
  
  private get confirmButton(): Locator {
    return this.page.getByTestId(this.btnConfirm);
  }
  
  private get closeButton(): Locator {
    return this.page.getByTestId(this.btnClose);
  }
  
  async selectSize(size: PizzaSize): Promise<void> {
    await this.sizeButton(size).click();
  }
  
  async toggleTopping(name: string): Promise<void> {
    await this.toppingChip(name).click();
  }
  
  sync getPrice(): Promise<string> {
    return (await this.priceLabel.innerText()).trim();
  }
  
  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }
  
  async close(): Promise<void> {
    await this.closeButton.click();
  }
  
  async expectOpen(): Promise<void> {
    // Sin role="dialog": nos anclamos a un testid propio del modal.
    await expect(this.confirmButton).toBeVisible();
  }
  
  async expectClosed(): Promise<void> {
    await expect(this.confirmButton).toBeHidden();
  }