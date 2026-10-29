import type {Page, Locator, expect} from "@playwright/test";
import { LoginPage, CatalogPage} from "../pages";
import { Market, User } from "../types";

import usersJson from "../data/users.json" with {type: "json"};
import marketJson from "../data/markets.json" with {type: "json"};



readonly path = "/checkout";

  private txtFullName: string = "full-name";
  private txtPhone: string = "phone";
  private txtAddress: string = "address";
  
  private txtZip: string = "zip-code";
  private btnPlaceOrder: string = "place-order-btn";
  private lblOrderTotal: string = "order-total";
  private modalConfirmOrder: string = "confirm-order-modal";
  
  private get fullNameInput(): Locator {
    return this.tid(this.txtFullName);
  }
  
  private get phoneInput(): Locator {
    return this.tid(this.txtPhone);
  }
  
  private get addressInput(): Locator {
    return this.tid(this.txtAddress);
  }
  
  private get zipInput(): Locator {
    return this.tid(this.txtZip);
  }
  
  private get placeOrderButton(): Locator {
    return this.tid(this.btnPlaceOrder);
  }
  
  private get orderTotal(): Locator {
    return this.tid(this.lblOrderTotal);
  }
  
  private get confirmOrderModal(): Locator {
    return this.tid(this.modalConfirmOrder);
  }
  
  async fillWithMarket(market: Market): Promise<void> {
    await this.fullNameInput.fill(market.fullName);
    await this.phoneInput.fill(market.phone);
    await this.addressInput.fill(market.address);
    await this.zipInput.fill(market.zipCode);
  }
  
  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
  
  async checkoutWith(market: Market): Promise<void> {
    await this.fillWithMarket(market);
    await this.placeOrder();
  }
  
  async expectLoaded(): Promise<void> {
    await expect(this.placeOrderButton).toBeVisible();
  }
  
  async expectConfirmation(): Promise<void> {
    await expect(this.confirmOrderModal).toBeVisible({ timeout: 20_000 });
    await expect(this.page.getByRole("dialog")).toBeVisible();
  }
  
  async expectTotalContains(currencySymbol: string): Promise<void> {
    await expect(this.orderTotal).toContainText(currencySymbol);
  }