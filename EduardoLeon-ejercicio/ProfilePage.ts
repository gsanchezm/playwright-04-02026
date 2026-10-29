import type {Page, Locator, expect} from "@playwright/test";
import { LoginPage, CatalogPage} from "../pages";
import { Market, User } from "../types";

import usersJson from "../data/users.json" with {type: "json"};
import marketJson from "../data/markets.json" with {type: "json"};


private txtAddress: string = "profile-address";
  private dateBirthday: string = "profile-birthday";
  private txtNotes: string = "profile-notes";
  private btnSave: string = "profile-save-btn";
  
  private get fullNameInput(): Locator {
    return this.tid(this.txtFullName);
  }
  
  private get phoneInput(): Locator {
    return this.tid(this.txtPhone);
  }
  
  private get birthdayInput(): Locator {
    // El date picker nativo: <input type="date">.
    return this.tid(this.dateBirthday);
  }
  
  private get notesInput(): Locator {
    return this.tid(this.txtNotes);
  }
  
  private get saveButton(): Locator {
    return this.tid(this.btnSave);
  }
  
  async goto(): Promise<void> {
    // Requiere sesión activa (si no, la app redirige a login).
    await this.page.goto(this.path);
  }
  
  async setBirthday(isoDate: string): Promise<void> {
    await this.birthdayInput.fill(isoDate);
  }
  
  async getBirthday(): Promise<string> {
    // El value de un input date SIEMPRE se lee en ISO "YYYY-MM-DD".
    return this.birthdayInput.inputValue();
  }
  
  async fillNotes(text: string): Promise<void> {
    await this.notesInput.fill(text);
  }
  
  async save(): Promise<void> {
    await this.saveButton.click();
  }
  
  async expectLoaded(): Promise<void> {
    await expect(this.birthdayInput).toBeVisible();
  }
  
  async expectLoaded(): Promise<void> {
    await expect(this.birthdayInput).toBeVisible();
  }
  
  async expectBirthday(isoDate: string): Promise<void> {
    await expect(this.birthdayInput).toHaveValue(isoDate);
  }