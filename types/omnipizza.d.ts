export type CountryCode = "MX" | "US" | "CH" | "JP" | "SA";
export type Currency = "MXN" | "USD" | "CFH" | "JPY" | "SAR";
export type Role = "customer";

export interface User{
    username: string;
    password: string;
    role?: Role;
    description?: string;
}

export interface Market{
    code: CountryCode;
    currency: Currency;
    fullName: string;
    country: string;
    phone: string;
    address: string;
    colonia?: string;
    district?: string;
    zipCode: string;
    taxRate: number;
}