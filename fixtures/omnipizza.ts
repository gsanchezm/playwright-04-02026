import { test as base, expect } from "@playwright/test";
import { LoginPage, CatalogPage } from "../pages";
import { Market, User } from "../types";
import usersJson from "../data/users.json" with {type: "json"};
import marketJson from "../data/markets.json" with {type: "json"};

const markets = marketJson as Market[];
const users = usersJson as User[];

type PageFixtures = {
    loginPage: LoginPage;
    catalogPage: CatalogPage;
    standardUser: User;
}

type WorkerFixtures = {
    defaultMarket: Market;
}

export const test = base.extend<PageFixtures, WorkerFixtures>({
    defaultMarket: [async ({ }, use) => {
        const us = markets.find((m) => m.code === "US");
        if (!us) throw new Error("US market not found in data/market.json");
        await use(us);
    }, { scope: "worker" }],

    standardUser: async ({ }, use) => {
        const standardUser = users.find((user) => user.username === "standard_user");

        if (!standardUser) {
            throw new Error("data/users.json does not contain a user with username 'standard_user'. Check the data seed before running");
        }
        await use(standardUser);
    },

    loginPage: async({page},use) =>{
        await use(new LoginPage(page));
    },

    catalogPage: async({page},use) =>{
        await use(new CatalogPage(page));
    }
});

export {expect};
export type {Market, User};